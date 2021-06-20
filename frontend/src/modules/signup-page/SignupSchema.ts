import * as yup from "yup";
import yuppassword from "yup-password";
import memoize from "memoizee";

yuppassword(yup);

interface ICreateFormValidation {
  id: string;
  message: string;
  validationFn: (value?: string) => any;
  async: boolean;
}

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

const validateUsername = createFormValidation({
  id: "checkDupUsername",
  message: "username already exists",
  async: true,
  validationFn: (value) => {
    // Just use your regular async/await and don't return a new promise
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve(true);
        } else {
          resolve(false);
        }
      }, Math.random() * (1000 - 200) + 200);
    });
  },
});

export const SignupSchema = yup.object().shape({
  name: yup.string().required(),
  username: yup
    .string()
    .min(3, "minimum 3 characters")
    .max(15, "maximum 15 characters")
    .required()
    .test(...validateUsername),
  email: yup.string().email().required(),
  password: yup.string().password().required(),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required(),
});