import React, { useEffect, useRef, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import {
  IoCheckmark,
  IoCheckmarkCircle,
  IoLockOpenOutline,
  IoMailOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { ContentBox } from "../../../components/ContentBox";
import { Button } from "../../../components/forms/Button";
import { Input } from "../../../components/forms/Input";
import createRegisterSchema from "./RegistrationSchema";
import { useWrapper } from "../../../context/WrapperProvider";

interface RegisterFormProps {
  captchaKey: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ captchaKey }) => {
  const [schema] = useState(createRegisterSchema());
  const hCaptchaRef = useRef<HCaptcha>(null);
  const { replace } = useRouter();
  const wrapper = useWrapper();
  const hasToken = !!wrapper.useTokenStore().authToken;
  const [formError, setFormError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);

  useEffect(() => {
    if (hasToken) {
      // AuthContext and WaitForAuth will take care
      // of verifying the access token validity
      replace("/");
    }
  }, [hasToken, replace]);

  return (
    <ContentBox
      centered
      heading={{
        title: "Welcome",
        subtitle: "Your regular registration tagline",
      }}
      className="min-w-40"
      error={formError}
    >
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          passwordConfirmation: "",
        }}
        validationSchema={schema.RegisterSchema}
        onSubmit={async (formData) => {
          // Trigger invisible hCaptcha
          try {
            if (!hCaptchaRef.current) {
              throw new Error();
            }

            const { response } = await hCaptchaRef.current.execute({
              async: true,
            });

            if (!response) {
              throw new Error();
            }
          } catch (error) {
            setFormError("Verification failed");
            return;
          }

          // Register user
          try {
            await wrapper.api.user.create({
              name: {
                firstName: formData.firstName,
                lastName: formData.lastName,
              },
              email: formData.email,
              password: formData.password
            });

            // Successful response
            setRegisterSuccess(true);

            setTimeout(() => {
              replace("/login");
            }, 500);
          } catch (error: any) {
            let errorMessage = "";

            if (
              error && error.message
            ) {
              errorMessage = error.message;
            } else {
              errorMessage = "An error occurred";
            }

            setFormError(errorMessage);
            hCaptchaRef.current.resetCaptcha();
          }
        }}
      >
        {({ errors, touched }) => {
          return (
            <Form>
              <div className="flex flex-col space-y-1.5">
                <Input
                  placeholder="First Name"
                  error={errors.firstName}
                  withIcon={<IoPersonOutline />}
                  name="firstName"
                  type="text"
                  touched={touched.firstName}
                />
                <Input
                  placeholder="Last Name"
                  error={errors.lastName}
                  withIcon={<IoPersonOutline />}
                  name="lastName"
                  type="text"
                  touched={touched.lastName}
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
              </div>
              <div className="mt-2">
                <HCaptcha
                  ref={hCaptchaRef}
                  theme="dark"
                  sitekey={captchaKey}
                  onVerify={() => {}}
                  size="invisible"
                />
              </div>
              <div className="mt-2">
                <Button type="submit">
                  {registerSuccess ? (
                    <IoCheckmarkCircle size="20" />
                  ) : (
                    "Submit Registration"
                  )}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </ContentBox>
  );
};
