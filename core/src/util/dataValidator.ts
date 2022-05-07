export type ValidatorObject<
  DT = {
    [dv: string]: any;
  }
> = {
  [E in keyof DT]: {
    validators?: {
      validator: (v: DT[E]) => boolean | any;
      onFail: (response, value: DT[E]) => any;
    }[];
    validator?: (v: DT[E]) => boolean | any;
    onFail?: (response, value: DT[E]) => any;
    onMissing?: () => void;
  };
};

export const dataValidator = async <Datatype = Object>(
  data: Datatype,
  validators: ValidatorObject<Datatype>
) => {
  const validatorKeys = Object.keys(validators);
  const dataKeys = Object.keys(data);

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
      if (!isValid && !!validators[v].onFail) validators[v].onFail(vdr);

      if (isValid && !!val.validators) {
        const finalValid = await Promise.all(
          val.validators.map(async (subv) => {
            const svdr = await subv.validator(data[v]);
            let valid = svdr == true;
            if (!valid) await subv.onFail(svdr, data[v]);
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
