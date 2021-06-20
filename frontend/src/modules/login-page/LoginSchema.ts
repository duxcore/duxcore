import * as yup from "yup";
import yuppassword from "yup-password";

yuppassword(yup);

export const LoginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().password().required(),
});
