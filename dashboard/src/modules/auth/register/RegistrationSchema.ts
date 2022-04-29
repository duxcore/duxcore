import * as yup from "yup";
import yuppassword from "yup-password";

export default function createRegisterSchema() {
  yuppassword(yup);

  return {
    RegisterSchema: yup.object().shape({
      firstName: yup.string().required(),
      lastName: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().password().required(),
      passwordConfirmation: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must match")
        .required(),
    }),
  };
}
