import Link from "next/link";
import React from "react";
import { useAuth } from "../modules/auth/useAuth";
import { Header } from "./header/Header";

interface LayoutProps {
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { user, logOut, revokeAllRefreshTokens } = useAuth();

  return (
    <>
      <Link href={"#main"}>
        <a className="fixed top-0 opacity-0 z-10 pointer-events-none focus:pointer-events-auto focus:cursor-pointer text-white focus:opacity-100">
          Skip to content
        </a>
      </Link>
      <title>Duxcore {title ? `| ${title}` : ""}</title>
      <Header/>
      <main id="main" className="w-full p-1 bg-gray-900 px-5 md:px-30">
        {children}
      </main>
    </>
  );
};
