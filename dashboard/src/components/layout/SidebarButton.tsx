/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React, { ReactElement } from "react";
interface SidebarButtonProps {
  icon?: ReactElement;
  selected: boolean;
  href: string;
  className: string;
}

export const SidebarButton: React.FC<SidebarButtonProps> = ({
  children,
  icon,
  selected,
  href,
  className,
}) => {
  return (
    <Link href={href} passHref={true}>
      <a
        className={`${className} flex gap-0.5 md:gap-0 justify-center align-middle flex-col items-center text-xs py-1 flex-1 md:flex-grow-0 md:w-auto transition-all hover:bg-gray-900 relative ${
          selected
            ? "font-semibold bg-opacity-80 bg-gray-900"
            : "opacity-95 text-opacity-20"
        }`}
      >
        <div
          className={`absolute h-0.25 w-full md:w-0.25 rounded-r-full md:h-full bottom-0 md:left-0 transition-all ${
            selected ? "bg-accent" : "bg-none"
          }`}
          role="separator"
        ></div>
        <span className="text-3xl">{icon}</span>
        <span>{children}</span>
      </a>
    </Link>
  );
};
