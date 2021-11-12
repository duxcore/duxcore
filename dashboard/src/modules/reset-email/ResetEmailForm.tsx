import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { IoLockOpenOutline } from "react-icons/io5";
import { ContentBox } from "../../components/ContentBox";
import { Button } from "../../components/forms/Button";
import { Input } from "../../components/forms/Input";
import { useWrapper } from "../../context/WrapperProvider";
import { LoginSchema } from "./ResetEmailSchema";

interface LoginFormProps {
  onSubmit: () => void;
}

export const ResetEmailForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const wrapper = useWrapper();
  const { query } = useRouter();
  const [formError, setFormError] = useState("");
  const [isLoading, setLoading] = useState(false);

  return (
    <ContentBox
      centered
      className="max-w-lg"
      heading={{ title: "Reset your email", subtitle: "Please enter your password below to confirm that you would like to reset your email address." }}
      error={formError}
    >

      <Formik
        initialValues={{ password: "" }}
        validationSchema={LoginSchema}
        onSubmit={async ({ password }) => {
          let token = query['token']?.toString() as string;
          let email = query['email']?.toString() as string;

          setLoading(true)

          try { await wrapper.api.user.verifyEmailReset(token, email, password) }
          catch (error: any) {
            if (error.data?.data?.errors.length > 0) setFormError(error.data?.data?.errors[0].message);
            else if (error && error.message) setFormError(error.message);
            else setFormError("An error occurred");

            setLoading(false);
            return;
          }

          onSubmit();
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <div className="flex flex-col space-y-1.5">
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
              <Button
                loading={isLoading}
                type="submit">Submit</Button>
            </div>
          </Form>
        )}
      </Formik>
    </ContentBox>
  );
};
