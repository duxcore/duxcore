import * as yup from "yup";
import yuppassword from "yup-password";
import memoize from "memoizee";
import wrapper from "@duxcore/wrapper";
import { debounce, throttle } from "throttle-debounce";
import { UsernameAPIResponse } from "../../../../wrapper/lib/types/restUser";

export default function createRegisterSchema(key?: string) {
  yuppassword(yup);

  interface ICreateFormValidation {
    id: string;
    message: string;
    validationFn: (value?: string) => any;
    async: boolean;
  }

  const testUsername = throttle(
    1000,
    (value: string, callback: (res: UsernameAPIResponse) => void) => {
      wrapper.rest.user.getUsername(value, key).then((res) => {
        return callback(res);
      });
    }
  );

  const createFormValidation = ({
    id,
    message,
    validationFn,
    async = false,
  }: ICreateFormValidation): [
    typeof id,
    typeof message,
    typeof validationFnWrapper
  ] => {
    const memoized = memoize(validationFn, { length: 1 });
    // prettier-ignore
    const validationFnWrapper = async function(this: any, value?: string) {
      if (!async) {
        // eslint-disable-next-line no-invalid-this
        return await validationFn.call(this, value);
      }

      // eslint-disable-next-line no-invalid-this
      return await memoized.call(this, value);
    };

    return [id, message, validationFnWrapper];
  };

  const checkUsername = createFormValidation({
    id: "checkUsername",
    message: "Username is not available...",
    async: true,
    validationFn: (value) => {
      return new Promise((resolve, reject) => {
        testUsername(value as string, (res) => {
          if (res.data?.status !== "available") return resolve(false);
          else return resolve(true);
        });
      });
    },
  });

  return {
    RegisterSchema: yup.object().shape({
      name: yup.string().required(),
      username: yup
        .string()
        .min(3, "minimum 3 characters")
        .max(24, "maximum 15 characters")
        .required()
        .test(...checkUsername),
      email: yup.string().email().required(),
      password: yup.string().password().required(),
      passwordConfirmation: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must match")
        .required(),
    }),
  };
}
