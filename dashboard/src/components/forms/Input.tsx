import { Field, FieldAttributes } from "formik";
import React from "react";
import { Spinner } from "../Spinner";

const inputStatusClass = {
  error: "border-error",
  idle: "border-gray-700 focus-within:border-gray-600",
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
    <div className="flex flex-col">
      <div
        className={`relative border rounded-5 transition overflow-hidden bg-gray-900 ${activeStatusClass}`}
      >
        <Field
          className="w-full h-full pl-5 text-white bg-transparent outline-none placeholder-gray-700 py-2 text-base"
          {...props}
        />

        {withIcon ? (
          <div className="ml-1.5 pointer-events-none text-gray-500 center-left">
            {React.cloneElement(withIcon, { size: 20 })}
          </div>
        ) : null}
        {error && touched && !loading ? (
          <div className="text-lg font-bold pointer-events-none text-error center-right mr-1.5">
            !
          </div>
        ) : null}
        {loading ? (
          <div className="center-right mr-4">
            <Spinner className="text-gray-300" />
          </div>
        ) : null}
      </div>
      {error && touched ? (
        <div className="mt-1 mb-1.5 text-error">{error}</div>
      ) : null}
    </div>
  );
};
