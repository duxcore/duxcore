import React, { ReactElement, useState } from "react";
import Link from "next/link";

interface DropdownButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  icon?: JSX.Element;
}

export const DropdownButton: React.FC<DropdownButtonProps> = ({
  onClick,
  href = "#",
  icon = <></>,
  children,
}) => {
  return (
    <Link href={href} passHref={true}>
      <button className="w-full hover:bg-gray-700 p-1 transition-all font-medium items-center text-md text-left" onClick={onClick}>
        <span style={{ verticalAlign: "baseline" }}>
          <span style={{ fontSize: "1.5rem" }} className="mr-1">
            {icon}
          </span>
          {children}
        </span>
      </button>
    </Link>
  );
};
