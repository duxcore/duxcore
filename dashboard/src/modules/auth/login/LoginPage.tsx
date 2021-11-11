import type { TokenPair } from "@duxcore/wrapper";
import { Form, Formik, FormikValues } from "formik";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useWrapper } from "../../../context/WrapperProvider";
import { PageComponent } from "../../../types/PageComponent";
import { LoginForm, LoginResponse } from "./LoginForm";

interface LoginPageProps { }

export const LoginPage: PageComponent<LoginPageProps> = () => {
  const wrapper = useWrapper();

  const hasToken = !!wrapper.useTokenStore().authToken
  const { replace } = useRouter();

  const onLogin = (authorization: TokenPair) => {
    // Set new auth token as axios Authorization header
    if (authorization) {
      wrapper.axios.setHeader(authorization.authToken);
      wrapper.useTokenStore.getState().setTokens({ authToken: authorization.authToken, refreshToken: authorization.refreshToken });
    }

    let redirectPath = "/";

    try {
      const possibleIntendedPath = localStorage.getItem(wrapper.constants.INTENDED_PATH_KEY);
      console.log(possibleIntendedPath);

      if (possibleIntendedPath && possibleIntendedPath.startsWith("/")) {
        redirectPath = possibleIntendedPath;
        localStorage.setItem(wrapper.constants.INTENDED_PATH_KEY, "");
      }
    } catch { }

    replace(redirectPath);
  };

  useEffect(() => {
    if (hasToken) {
      // AuthContext and WaitForAuth will take care
      // of verifying the auth token validity
      replace("/");
    }
  }, [hasToken, replace]);

  return <LoginForm onLogin={onLogin} />;
};

LoginPage.requiresAuth = false;
