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
          className="w-full h-full pl-40 text-white bg-transparent outline-none placeholder-primary-700 py-14"
          {...props}
        />

        {withIcon ? (
          <div className="ml-10 pointer-events-none text-primary-500 center-left">
            {React.cloneElement(withIcon, { size: 20 })}
          </div>
        ) : null}
        {error && touched && !loading ? (
          <div className="text-lg font-bold pointer-events-none text-error center-right mr-14">
            !
          </div>
        ) : null}
        {loading ? (
          <div className="center-right mr-14">
            <Spinner className="text-primary-300" />
          </div>
        ) : null}
      </div>
      {error && touched ? <div className="mt-5 text-error">{error}</div> : null}
    </div>
  );
};
