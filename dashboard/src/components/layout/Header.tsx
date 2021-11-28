/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "../../modules/auth/useAuth";
import { useRouter } from "next/router";
import { Button } from "../forms/Button";
import { IoChevronDown } from "react-icons/io5";
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
      {/* <Link href={"/"} passHref={true}>
        <a className="h-full w-auto relative flex items-center gap-1 mr-2 md:mr-0">
          <img
            height={"45em"}
            width={"45em"}
            src="/logo.svg"
            alt="Duxcore"
            className="h-full md:hidden"
          />
          <img
            src="/logo-full.svg"
            alt="Duxcore"
            className="h-full hidden md:block"
            style={{ padding: "2.2rem 0 2.2rem 0" }}
          />
        </a>
      </Link> */}
      <nav className="flex-grow flex items-center gap-2 overflow-x-auto">
        {navLinks.map((link, i) => {
          return (
            <Button
              className="px-1"
              key={i}
              onClick={() => router.push(link[1])}
              color={
                router.pathname === link[1] ? "invisibleClicking" : "invisible"
              }
            >
              {link[0]}
            </Button>
          );
        })}
        {children}
      </nav>
      <div className="flex-shrink flex items-center relative">
        <AccountDrop />
      </div>
    </header>
  );
};
