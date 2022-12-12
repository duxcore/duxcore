import React, { useState } from "react";
import { Spinner } from "../Spinner";

const buttonSizes = {
  full: "w-full",
};

const buttonColors = {
  primary:
    "text-white py-1.5 font-bold bg-accent transition hover:bg-accent-light disabled:bg-accent-lighter disabled:cursor-not-allowed",
  invisible:
    "text-white py-1 font-semibold bg-black transition hover:bg-gray-800 disabled:bg-black disabled:cursor-not-allowed",
  invisibleClicking:
    "text-white py-1 font-semibold transition bg-gray-800 disabled:bg-black disabled:cursor-not-allowed",
  outline:
    "text-white py-1.5 font-bold border border-accent bg-transparent transition hover:bg-accent disabled:bg-accent-lighter disabled:cursor-not-allowed",

};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: keyof typeof buttonSizes;
  color?: keyof typeof buttonColors;
  loading?: boolean;
  clickHook?: [boolean, React.Dispatch<React.SetStateAction<boolean>>, boolean];
}

export const Button: React.FC<ButtonProps> = ({
  size = "full",
  color = "primary",
  children,
  loading = false,
  disabled,
  clickHook,
  className = "",
  ...props
}) => {
  const [clicked, setClicked, isToggle] = clickHook || [undefined];
  return (
    <div>
      <button
        disabled={disabled || loading}
        onMouseDown={() => (clickHook && setClicked ? setClicked(isToggle ? !clicked : true) : undefined)}
        onMouseUp={() => (clickHook && setClicked && !isToggle ? setClicked(false) : undefined)}
        className={`rounded-5 flex items-center justify-center ${buttonSizes[size]} ${buttonColors[color]} ${className}`}
        {...props}
      >
        {loading ? <Spinner /> : children}
      </button>
    </div>
  );
};
