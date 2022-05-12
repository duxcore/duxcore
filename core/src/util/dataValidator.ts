export type ValidatorObject<
  DT = {
    [dv: string]: any;
  }
> = {
  [E in keyof DT]: {
    validators?: {
      validator: (v: DT[E]) => boolean | any;
      onFail: (response, value: DT[E]) => any;
      onSuccess?: (value: DT[E]) => any;
    }[];
    validator?: (v: DT[E]) => boolean | any;
    onFail?: (response, value: DT[E]) => any;
    onSuccess?: (value: DT[E]) => any;
    onMissing?: () => void;
  };
};

export const dataValidator = async <Datatype = Object>(
  data: Datatype,
  validators: ValidatorObject<Datatype>,
  options?: {
    onUnexpectedValue?: (key, value) => void;
    emptyData?: () => void;
  }
) => {
  const validatorKeys = Object.keys(validators);
  const dataKeys = Object.keys(data);

  if ((!data || dataKeys.length == 0) && options?.emptyData)
    return await options.emptyData();

  await Promise.all(
    dataKeys.flatMap(async (v) => {
      if (!validatorKeys.includes(v)) {
        if (options?.onUnexpectedValue)
          return await options.onUnexpectedValue(v, data[v]);
        return;
      }
    })
  );

  const validityObject = await Promise.all(
    validatorKeys.flatMap(async (v) => {
      if (!dataKeys.includes(v)) {
        if (validators[v].onMissing) await validators[v].onMissing();
        return false;
      }

      const val = validators[v];

      const vdr = !!validators[v].validator
        ? await validators[v].validator(data[v])
        : null;
      const isValid = !!validators[v].validator ? vdr == true : true;
      if (!isValid && !!validators[v].onFail)
        await validators[v].onFail(vdr, data[v]);

      if (isValid && validators[v].onSuccess)
        await validators[v].onSuccess(data[v]);

      if (isValid && !!val.validators) {
        const finalValid = await Promise.all(
          val.validators.map(async (subv) => {
            const svdr = await subv.validator(data[v]);
            let valid = svdr == true;
            if (!valid) await subv.onFail(svdr, data[v]);
            if (valid && subv.onSuccess) await subv.onSuccess(data[v]);
            return valid;
          })
        );
      }

      return isValid;
    })
  );

  if (validityObject.includes(false)) return false;
  return true;
};
