/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useAuth } from "../../modules/auth/useAuth";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../forms/Button";
interface HeaderProps {
  title?: string
}

export const Header: React.FC<HeaderProps> = ({ children, title }) => {
  const { user, logOut } = useAuth();
  const router = useRouter();

  const navLinks = [
    ["Overview", "/"],
    ["Usage", "/usage"],
    ["Settings", "/settings"],
  ];

  return (
    <header
      className="w-full h-full sticky top-0 flex justify-between"
      style={{ gridArea: "header" }}
    >
      <Link href={"/"} passHref={true}>
        <a className="h-full w-auto relative flex items-center gap-1 mr-2 md:mr-0 md:hidden">
          <img src="/logo.svg" alt="Duxcore" className="h-3" />
        </a>
      </Link>
      <a className="flex-shrink hidden md:flex items-center relative px-2">
        <span className="ml-1 md:block hidden font-bold text-2xl">{title || 'Dashboard'}</span>
      </a>
      <nav className="flex-grow flex items-center gap-2 overflow-x-auto">
        {children}
      </nav>
      <Link href="/create">
        <a className="flex-shrink hidden md:flex items-center relative px-2">
          <span className="ml-1 md:block hidden font-bold text-lg">+ New</span>
        </a>
      </Link>
      <Link href="/profile">
        <a className="flex-shrink hidden md:flex items-center relative px-2">
          <Image
            // src="https://plchldr.co/i/256x256?bg=fd4d4d"
            src="/profilePlaceholder.png"
            alt={`${user?.firstName}'s Profile Picture`}
            objectFit="cover"
            className="rounded-full"
            layout="fixed"
            height={"30rem"}
            width={"30rem"}
          ></Image>
          <span className="ml-1 md:block hidden font-bold text-lg">{user?.firstName}</span>
        </a>
      </Link>
    </header>
  );
};
