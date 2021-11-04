import React from "react";
import { PageComponent } from "../../../types/PageComponent";
import { RegisterForm } from "./RegisterForm";

interface RegisterPageProps {
  captchaKey: string;
}

export const RegisterPage: PageComponent<RegisterPageProps> = ({
  captchaKey,
}) => {
  return <RegisterForm captchaKey={captchaKey} />;
};

RegisterPage.requiresAuth = false;
