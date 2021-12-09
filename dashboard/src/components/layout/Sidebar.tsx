/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useAuth } from "../../modules/auth/useAuth";
import { useRouter } from "next/router";
import {
  IoCartOutline,
  IoCloudOutline,
  IoDocumentTextOutline,
} from "react-icons/io5";
import { AccountDrop } from "./AccountDrop";
import Link from "next/link";
import { SidebarButton } from "./SidebarButton";
import styles from "../../styles/layout.module.css";
interface SidebarProps {}

export const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const { user, logOut } = useAuth();
  const router = useRouter();

  const navLinks = [
    { name: "Overview", icon: <IoCloudOutline />, path: "/" },
    { name: "Marketplace", icon: <IoCartOutline />, path: "/marketplace" },
    {
      name: "Billing",
      icon: <IoDocumentTextOutline />,
      path: "/profile/billing",
    },
    {
      name: "Profile",
      icon: (
        <img
          className="h-3 rounded-full"
          alt={`${user?.firstName}'s Profile Picture`}
          src="/profilePlaceholder.png"
        />
      ),
      path: "/profile",
      className: "flex md:hidden",
    },
  ];

  return (
    <aside
      className={`w-full h-full bg-black border-t md:border-r border-gray-800 border-solid sticky top-0 flex justify-around md:grid ${styles.sidebar}`}
      style={{
        gridArea: "sidebar",
      }}
    >
      <Link href={"/"} passHref={true}>
        <a className="h-full w-full p-2 hidden md:block">
          <img src="/logo.svg" alt="Duxcore" className="h-full w-full" />
        </a>
      </Link>
      <nav className="flex md:flex-col flex-1 justify-center gap-1">
        {/* <SidebarButton icon={<IoCloud />}>Overview</SidebarButton>
         */}
        {navLinks.map((link, i) => {
          return (
            <SidebarButton
              href={link.path}
              icon={link.icon}
              key={i}
              selected={router.pathname === link.path}
              className={link.className || ""}
            >
              {link.name}
            </SidebarButton>
          );
        })}
      </nav>
    </aside>
  );
};
