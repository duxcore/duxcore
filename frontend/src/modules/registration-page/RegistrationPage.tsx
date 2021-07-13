import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import React, { useRef, useState } from "react";
import { Input } from "../../ui/forms/Input";
import {
  IoAtOutline,
  IoLockOpenOutline,
  IoMailOutline,
  IoPersonOutline,
} from "react-icons/io5";
import createRegisterSchema from "./RegistrationSchema";
import { Button } from "../../ui/Button";
import wrapper from "@duxcore/wrapper";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";

interface FormValues {
  name: string;
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  captchaToken: string;
}

interface RegistrationPageProps {
  reservedUsername: {
    key: string;
    username: string;
  } | null;
  captchaKey: string;
}

// const ws = wrapper.ws();
export const RegistrationPage: React.FC<RegistrationPageProps> = (props) => {
  const [captchaComplete, setCaptchaComplete] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const captchaRef = useRef<HCaptcha>(null);

  const siteKey = props.captchaKey;
  const hasValidToken = !!props.reservedUsername;
  const schema = createRegisterSchema(props.reservedUsername?.key ?? undefined);

  const initialValues: FormValues = {
    name: "",
    username:
      hasValidToken && props.reservedUsername
        ? props.reservedUsername.username
        : "",
    email: "",
    password: "",
    passwordConfirmation: "",
    captchaToken,
  };

  const [formValues, setFormValues] = useState<FormValues>(initialValues);

  const handleSubmit = (token: string) => {
    const values = formValues;
    console.log({ values, token });

    wrapper.rest.user
      .register(
        values.username,
        values.name,
        values.email,
        values.password,
        token,
        props.reservedUsername?.key ?? undefined
      )
      .then((r) => {
        console.log(r);
      });
  };

  const validateCaptcha = (values: FormValues) => {
    console.log("here");
    if (captchaRef.current) captchaRef.current.execute();
    setFormValues(values);
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
            initialValues={initialValues}
            validationSchema={schema.RegisterSchema}
            onSubmit={validateCaptcha}
          >
            {({ errors, touched, isValidating }) => {
              return (
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
                      readOnly={!!hasValidToken}
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
                    <div className={`${captchaError ? "" : "hidden"}`}>
                      <HCaptcha
                        sitekey={siteKey}
                        onVerify={handleSubmit}
                        theme="dark"
                        ref={captchaRef}
                        onError={() => setCaptchaError(true)}
                      />
                    </div>
                    <Button type="submit">Sign Up</Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
};
