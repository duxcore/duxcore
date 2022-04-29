import type { TokenPair } from "wrapper";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { IoLockOpenOutline, IoMailOutline } from "react-icons/io5";
import { ContentBox } from "../../../components/ContentBox";
import { Button } from "../../../components/forms/Button";
import { Input } from "../../../components/forms/Input";
import { useWrapper } from "../../../context/WrapperProvider";
import { LoginSchema } from "./LoginSchema";

interface LoginFormProps {
  onLogin: (authorization: TokenPair) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const wrapper = useWrapper();
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
          let res: TokenPair | null = null;

          try {
            res = await wrapper.api.user.login(email, password);
          } catch (error: any) {
            console.log(error)
            if (error.data.data.errors.length > 0) {
              return setFormError(error.data.data.errors[0].message);
            }

            if (
              error && error.message
            ) {
              setFormError(error.message);
              return;
            }

            setFormError("An error occurred");
            return;
          }

          onLogin(res);
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
