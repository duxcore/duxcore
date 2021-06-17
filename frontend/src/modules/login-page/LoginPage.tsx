import { Form, Formik, FormikValues } from "formik";
import React from "react";
import { Input } from "../../ui/forms/Input";
import { IoLockOpenOutline, IoMailOutline } from "react-icons/io5";
import { LoginSchema } from "./LoginSchema";
import { Button } from "../../ui/Button";

interface LoginPageProps {}

export const LoginPage: React.FC<LoginPageProps> = () => {
  const handleSubmit = (values: FormikValues) => {
    console.log(values);
  };

  return (
    <div className="w-full">
      <div className="center-xy">
        <div className="border border-primary-800 p-40 rounded-8">
          <div className="mb-30">
            <div className="text-3xl font-bold">Welcome</div>
            <div className="text-primary-500">Your regular login tagline</div>
          </div>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="flex flex-col space-y-15">
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
                  <Button type="submit">Log in</Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
