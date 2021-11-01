import { Field, FieldAttributes } from "formik";
import React from "react";
import { Spinner } from "../Spinner";

const inputStatusClass = {
  error: "border-error",
  idle: "border-primary-700 focus-within:border-primary-600",
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  withIcon?: React.ReactElement;
  error?: string;
  touched?: boolean;
  loading?: boolean;
}

export const Input: React.FC<FieldAttributes<InputProps>> = ({
  withIcon,
  error,
  touched,
  loading = false,
  ...props
}) => {
  let activeStatusClass = inputStatusClass.idle;

  if (error && touched) {
    activeStatusClass = inputStatusClass.error;
  }

  return (
    <div className="flex flex-col" style={{ width: 300 }}>
      <div
        className={`relative border rounded-5 transition overflow-hidden bg-primary-900 ${activeStatusClass}`}
      >
        <Field
          className="w-full h-full placeholder-primary-700 outline-none py-15 pl-40 bg-transparent"
          {...props}
        />

        {withIcon ? (
          <div className="text-primary-500 pointer-events-none center-left ml-10">
            {React.cloneElement(withIcon, { size: 20 })}
          </div>
        ) : null}
        {error && touched && !loading ? (
          <div className="text-error pointer-events-none center-right mr-15 font-bold text-lg">
            !
          </div>
        ) : null}
        {loading ? (
          <div className="center-right mr-15">
            <Spinner className="text-primary-300" />
          </div>
        ) : null}
      </div>
      {error && touched ? <div className="text-error mt-5">{error}</div> : null}
    </div>
  );
};
