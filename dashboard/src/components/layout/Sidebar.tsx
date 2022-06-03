/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useAuth } from "../../modules/auth/useAuth";
import { useRouter } from "next/router";
import { AccountDrop } from "./AccountDrop";
import Link from "next/link";
import { SidebarButton } from "./SidebarButton";
import styles from "../../styles/layout.module.css";
import { ShoppingCart, FolderCopy, BarChart, Support } from "@mui/icons-material";
interface SidebarProps {}

export const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const { user, logOut } = useAuth();
  const router = useRouter();

  const navLinks = [
    { name: "Dashboard", icon: <FolderCopy />, path: "/" },
    { name: "Marketplace", icon: <ShoppingCart />, path: "/marketplace" },
    {
      name: "Statistics",
      icon: <BarChart />,
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
      className: "",
    },
    {
      name: "Support",
      icon: <Support />,
      path: "/support",
    },
  ];

  return (
    <aside
      className={`bg-gray-900 w-full h-full md:border-r border-gray-800 border-solid sticky top-0 flex justify-around md:grid ${styles.sidebar}`}
      style={{
        gridArea: "sidebar",
      }}
    >
      <Link href={"/"} passHref={true}>
        <a className="h-full w-full p-2 hidden md:block">
          <div className="float-center">
            <img src="/logo.svg" alt="Duxcore" className="h-full float-left" />
            <span className="px-2 text-3xl font-bold leading-normal">Duxcore</span>
          </div>
        </a>
      </Link>
      <nav className="flex md:flex-col flex-1 gap-1 mt-4">
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
