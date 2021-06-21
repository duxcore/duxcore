import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import React from "react";
import { Input } from "../../ui/forms/Input";
import {
  IoAtOutline,
  IoLockOpenOutline,
  IoMailOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { RegisterSchema } from "./RegistrationSchema";
import { Button } from "../../ui/Button";

interface RegistrationPageProps {}

export const RegistrationPage: React.FC<RegistrationPageProps> = () => {
  const handleSubmit = (values: FormikValues) => {
    console.log(values);
  };

  return (
    <div className="w-full">
      <div className="center-xy">
        <div className="border border-primary-800 p-40 rounded-8">
          <div className="mb-30">
            <div className="text-3xl font-bold">Welcome</div>
            <div className="text-primary-500">
              Your regular registration tagline
            </div>
          </div>
          <Formik
            initialValues={{
              name: "",
              username: "",
              email: "",
              password: "",
              passwordConfirmation: "",
            }}
            validationSchema={RegisterSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isValidating }) => (
              <Form>
                <div className="flex flex-col space-y-15">
                  <Input
                    placeholder="Name"
                    error={errors.name}
                    withIcon={<IoPersonOutline />}
                    name="name"
                    type="text"
                    touched={touched.name}
                  />
                  <Input
                    placeholder="Username"
                    error={errors.username}
                    withIcon={<IoAtOutline />}
                    name="username"
                    type="text"
                    loading={isValidating}
                    touched={touched.username}
                  />
                  <Input
                    placeholder="Email Address"
                    error={errors.email}
                    withIcon={<IoMailOutline />}
                    name="email"
                    type="text"
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
                  <Input
                    placeholder="Confirm"
                    error={errors.passwordConfirmation}
                    withIcon={<IoLockOpenOutline />}
                    name="passwordConfirmation"
                    type="password"
                    touched={touched.passwordConfirmation}
                  />
                  <Button type="submit">Submit Registration</Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
