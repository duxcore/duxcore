import type { TokenPair } from "@duxcore/wrapper";
import { Form, Formik, FormikValues } from "formik";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useWrapper } from "../../../context/WrapperProvider";
import { useNextRedirection } from "../../../hooks/useNextRedirection";
import { PageComponent } from "../../../types/PageComponent";
import { LoginForm } from "./LoginForm";

interface LoginPageProps { }

export const LoginPage: PageComponent<LoginPageProps> = () => {
  const wrapper = useWrapper();
  const execRedirection = useNextRedirection();

  const hasToken = !!wrapper.useTokenStore().authToken;
  const { replace } = useRouter();

  const onLogin = (authorization: TokenPair) => {
    // Set new auth token as axios Authorization header
    if (authorization) {
      wrapper.axios.setHeader(authorization.authToken);
      wrapper.useTokenStore.getState().setTokens({ authToken: authorization.authToken, refreshToken: authorization.refreshToken });
    }

    execRedirection();
  };

  useEffect(() => {
    if (hasToken) {
      // AuthContext and WaitForAuth will take care
      // of verifying the auth token validity
      replace("/");
    }
  }, []);

  return <LoginForm onLogin={onLogin} />;
};

LoginPage.requiresAuth = false;
