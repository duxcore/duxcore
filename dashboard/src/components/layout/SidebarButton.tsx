/* eslint-disable @next/next/no-img-element */
import React, { ReactElement, useState } from "react";
import Image from "next/image";
import { useAuth } from "../../modules/auth/useAuth";
import { useRouter } from "next/router";
import { Button } from "../forms/Button";
import { IoChevronDown } from "react-icons/io5";
import { AccountDrop } from "./AccountDrop";
import Link from "next/link";
import { IconType } from "react-icons";
interface SidebarButtonProps {
  icon?: ReactElement;
  selected: boolean;
}

export const SidebarButton: React.FC<SidebarButtonProps> = ({
  children,
  icon,
  selected,
}) => {
  return (
    <a
      className={`flex justify-center align-middle flex-col items-center text-xs py-1 transition-all hover:bg-gray-900 ${
        selected
          ? "font-semibold border-solid box-border border-r border-collapse border-accent bg-opacity-80 bg-gray-900"
          : "opacity-95 text-opacity-20"
      }`}
      style={
        selected ? { marginRight: "-1.85px", borderRightWidth: 2.5 } : undefined
      }
    >
      <span className="text-3xl">{icon}</span>
      <span>{children}</span>
    </a>
  );
};
