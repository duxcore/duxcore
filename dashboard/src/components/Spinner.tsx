import React from "react";

const spinnerSizes = {
  "5": "h-2 w-2",
  "10": "h-1 w-1",
};

interface SpinnerProps {
  size?: keyof typeof spinnerSizes;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "5",
  className = "",
}) => {
  return (
    <svg
      className={`animate-spin ${className} ${spinnerSizes[size]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
};
