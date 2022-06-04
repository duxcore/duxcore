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
        className={`flex gap-0.5 md:gap-0 flex-row py-1 px-2 rounded flex-1 md:flex-grow-0 md:w-auto transition-all hover:bg-duxdark-800 relative ${
          selected
            ? "font-semibold bg-opacity-80 !bg-duxdark-900"
            : "opacity-95 text-opacity-20"
        }`}
      >
        <span className="text-3xl w-4">{icon}</span>
        <span className={`${className} mt-[0.25rem] text-2xl ml-2`}>{children}</span>
      </a>
    </Link>
  );
};
