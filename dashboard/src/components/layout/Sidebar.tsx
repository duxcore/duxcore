/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "../../modules/auth/useAuth";
import { useRouter } from "next/router";
import { Button } from "../forms/Button";
import { IoCloud, IoCloudOutline, IoPieChart, IoPieChartOutline, IoSettings, IoSettingsOutline } from "react-icons/io5";
import { AccountDrop } from "./AccountDrop";
import Link from "next/link";
import { SidebarButton } from "./SidebarButton";
interface SidebarProps {}

export const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const { user, logOut } = useAuth();
  const router = useRouter();

  const navLinks = [
    { name: "Overview", icon: <IoCloudOutline />, path: "/" },
    { name: "Usage", icon: <IoPieChartOutline />, path: "/usage" },
    { name: "Settings", icon: <IoSettingsOutline />, path: "/settings" },
  ];

  return (
    <aside
      className="w-full h-full bg-black border-r border-gray-800 border-solid sticky top-0 grid"
      style={{
        gridArea: "sidebar",
        gridTemplate: `
      'logo' 5rem
      'nav'
      `,
      }}
    >
      <Link href={"/"} passHref={true}>
        <a className="h-full w-full p-2">
          <img src="/logo.svg" alt="Duxcore" className="h-full w-full" />
        </a>
      </Link>
      <nav className="flex flex-col justify-center gap-1">
        {/* <SidebarButton icon={<IoCloud />}>Overview</SidebarButton>
         */}
        {navLinks.map((link, i) => {
          return (
            <SidebarButton icon={link.icon} key={i} selected={router.pathname === link.path}>
              {link.name}
            </SidebarButton>
          );
        })}
      </nav>
    </aside>
  );
};
