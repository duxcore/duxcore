import React from "react";

interface ContentBoxProps {
  centered?: boolean;
  heading?: {
    title: string;
    subtitle?: string;
  };
  className?: string;
  error?: string;
}

export const ContentBox: React.FC<ContentBoxProps> = ({
  centered = false,
  heading,
  children,
  className = "",
  error,
}) => {
  return (
    <div className={`${centered ? "center-xy" : ""} ${className}`}>
      <div className="p-3 border border-gray-800 rounded-8">
        {heading ? (
          <div className="mb-3">
            <div className="text-3xl font-bold text-white mb-0.5">
              {heading.title}
            </div>
            {heading.subtitle ? (
              <div className="text-gray-500">{heading.subtitle}</div>
            ) : null}
          </div>
        ) : null}
        {children}
        {error ? (
          <div className="text-error mt-2 text-center">{error}</div>
        ) : null}
      </div>
    </div>
  );
};
