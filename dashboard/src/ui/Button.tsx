import React from "react";
import { Spinner } from "./Spinner";

const buttonSizes = {
  full: "w-full",
};

const buttonColors = {
  primary:
    "text-white bg-accent transition hover:bg-accent-hover disabled:bg-accent-disabled disabled:cursor-not-allowed",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: keyof typeof buttonSizes;
  color?: keyof typeof buttonColors;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  size = "full",
  color = "primary",
  children,
  loading = false,
  disabled,
  ...props
}) => {
  return (
    <div>
      <button
        disabled={disabled || loading}
        className={`rounded-5 py-5 font-bold flex items-center justify-center ${buttonSizes[size]} ${buttonColors[color]}`}
        {...props}
      >
        {loading ? <Spinner /> : children}
      </button>
    </div>
  );
};
