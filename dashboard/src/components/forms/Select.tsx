import { Field, FieldAttributes } from "formik";
import React from "react";
import { Spinner } from "../Spinner";

const SelectStatusClass = {
  error: "border-error",
  idle: "border-gray-700 focus-within:border-gray-600",
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  withIcon?: React.ReactElement;
  error?: string;
  touched?: boolean;
  loading?: boolean;
}

export const Select: React.FC<FieldAttributes<SelectProps>> = ({
  withIcon,
  error,
  touched,
  loading = false,
  children,
  ...props
}) => {
  let activeStatusClass = SelectStatusClass.idle;

  if (error && touched) {
    activeStatusClass = SelectStatusClass.error;
  }

  return (
    <div className="flex flex-col">
      <div
        className={`relative border rounded-5 transition overflow-hidden bg-gray-900 ${activeStatusClass}`}
      >
        <Field
          as="select"
          className="w-full h-full pl-5 text-white bg-transparent outline-none placeholder-gray-700 py-1.5 text-base"
          {...props}
        >{children}</Field>
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
        <div className="my-1 text-error text-sm">{error}</div>
      ) : null}
    </div>
  );
};
