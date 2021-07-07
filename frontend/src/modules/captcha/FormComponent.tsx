import React, { forwardRef } from "react";
import { Formik, FormikConfig, Form, Field, FormikErrors } from "formik";
import HCaptcha from "@hcaptcha/react-hcaptcha";

interface FormValues {
  captcha: string;
  first_name: string;
}
interface Props extends FormikConfig<FormValues> {
  siteKey: string;
}

export const FormComponent = forwardRef<HCaptcha, Props>(
  ({ siteKey, ...formikProps }, captchaRef) => {
    return (
      <div style={{ marginTop: 30 }}>
        <Formik
          {...formikProps}
          validate={({ first_name }) => {
            let errors: FormikErrors<FormValues> = {};
            if (!first_name) {
              errors.first_name = "Enter your first name";
            }
            return errors;
          }}
        >
          {({ setFieldValue, submitForm, errors, touched }) => (
            <Form>
              <label
                style={{
                  color:
                    touched.first_name && errors.first_name ? "red" : "black"
                }}
              >
                First Name
              </label>
              <Field name="first_name" />
              {touched.first_name && errors.first_name && (
                <div style={{ color: "red" }}>{errors.first_name}</div>
              )}
              <HCaptcha
                ref={captchaRef}
                sitekey={siteKey}
                onVerify={token => setFieldValue("captcha", token)}
              />
              <button type="submit" onClick={submitForm}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
);
