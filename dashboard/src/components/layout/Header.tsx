/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useAuth } from "../../modules/auth/useAuth";
import { useRouter } from "next/router";
import { AccountDrop } from "./AccountDrop";
import Link from "next/link";
interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({ children }) => {
  const { user, logOut } = useAuth();
  const router = useRouter();

  const navLinks = [
    ["Overview", "/"],
    ["Usage", "/usage"],
    ["Settings", "/settings"],
  ];

  return (
    <header
      className="w-full h-full bg-black border-b border-gray-800 border-solid sticky top-0 flex justify-between px-2 md:gap-6 sm:gap-3"
      style={{ gridArea: "header" }}
    >
      <Link href={"/"} passHref={true}>
        <a className="h-full w-auto relative flex items-center gap-1 mr-2 md:mr-0 md:hidden">
          <img src="/logo.svg" alt="Duxcore" className="h-3" />
        </a>
      </Link>
      <nav className="flex-grow flex items-center gap-2 overflow-x-auto">
        {children}
      </nav>
      <div className="flex-shrink hidden md:flex items-center relative">
        <AccountDrop />
      </div>
    </header>
  );
};
