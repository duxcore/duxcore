import { Form, Formik, FormikValues } from "formik";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useGetIntendedPath } from "../../../hooks/useGetIntendedPath";
import { setAxiosHeader } from "../../../lib/axiosInstance";
import { INTENDED_PATH_KEY } from "../../../lib/constants";
import { PageComponent } from "../../../types/PageComponent";
import { useHasToken } from "../useHasToken";
import { useTokenStore } from "../useTokenStore";
import { LoginForm, LoginResponse } from "./LoginForm";

interface LoginPageProps {}

export const LoginPage: PageComponent<LoginPageProps> = () => {
  useGetIntendedPath();

  const hasToken = useHasToken();
  const { replace } = useRouter();

  const onLogin = (data: LoginResponse["data"]) => {
    // Set new access token as axios Authorization header
    if (data.jwt) {
      setAxiosHeader(data.jwt);
      useTokenStore.getState().setToken({ accessToken: data.jwt });
    }

    let redirectPath = "/";

    try {
      const possibleIntendedPath = localStorage.getItem(INTENDED_PATH_KEY);

      if (possibleIntendedPath && possibleIntendedPath.startsWith("/")) {
        redirectPath = possibleIntendedPath;
        localStorage.setItem(INTENDED_PATH_KEY, "");
      }
    } catch {}

    replace(redirectPath);
  };

  useEffect(() => {
    if (hasToken) {
      // AuthContext and WaitForAuth will take care
      // of verifying the access token validity
      replace("/");
    }
  }, [hasToken, replace]);

  return <LoginForm onLogin={onLogin} />;
};
