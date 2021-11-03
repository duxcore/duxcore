import _axios, { AxiosResponse } from "axios";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { IoLockOpenOutline, IoMailOutline } from "react-icons/io5";
import { ContentBox } from "../../../components/ContentBox";
import { Button } from "../../../components/forms/Button";
import { Input } from "../../../components/forms/Input";
import { useAxios } from "../../../context/AxiosProvider";
import { API_BASEURL } from "../../../lib/constants";
import { LoginSchema } from "./LoginSchema";

export type LoginResponse = {
  data: {
    authorization: {
      authToken: string,
      refreshToken: string
    } | null;
    emailExists: boolean;
    passwordValid: boolean;
    userId: any;
  };
};

interface LoginFormProps {
  onLogin: (data: LoginResponse["data"]) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const axios = useAxios();
  const [formError, setFormError] = useState("");

  return (
    <ContentBox
      centered
      heading={{ title: "Welcome", subtitle: "Your regular login tagline" }}
      className="min-w-40"
      error={formError}
    >
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={async ({ email, password }) => {
          let res: AxiosResponse<LoginResponse> | null = null;

          try {
            res = await axios(`${API_BASEURL}/users/auth`, {
              method: "POST",
              data: {
                email,
                password,
              },
            });
          } catch (error) {

            if ((error as any).response.data.data.errors.length > 0) {
              return setFormError((error as any).response.data.data.errors[0].message)
            }

            if (
              _axios.isAxiosError(error) &&
              error.response &&
              "message" in error.response.data
            ) {
              setFormError(error.response.data.message);
              return;
            }

            console.log((error as any).response.data.data)

            setFormError("An error occurred");
            return;
          }

          onLogin(res.data.data);
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <div className="flex flex-col space-y-1.5">
              <Input
                placeholder="Email Address"
                error={errors.email}
                withIcon={<IoMailOutline />}
                name="email"
                type="text"
                autoComplete="off"
                touched={touched.email}
              />
              <Input
                placeholder="Password"
                error={errors.password}
                withIcon={<IoLockOpenOutline />}
                name="password"
                type="password"
                touched={touched.password}
              />
            </div>
            <div className="mt-1.5">
              <Button type="submit">Log in</Button>
            </div>
          </Form>
        )}
      </Formik>
    </ContentBox>
  );
};
