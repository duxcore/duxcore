import * as yup from "yup";
import yuppassword from "yup-password";

yuppassword(yup);

export const LoginSchema = yup.object().shape({
  password: yup.string().required(),
});
