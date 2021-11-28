import Link from "next/link";
import React from "react";
import { useAuth } from "../modules/auth/useAuth";
import { Header } from "./layout/Header";
import { Sidebar } from "./layout/Sidebar";

interface LayoutProps {
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { user, logOut, revokeAllRefreshTokens } = useAuth();

  return (
    <>
      <title>Duxcore {title ? `| ${title}` : ""}</title>
      <main
        id="maincontent"
        className="w-full p-0 bg-gray-900 grid h-screen"
        style={{
          gridTemplate: `
            "sidebar header header header header" 5rem 
            "sidebar content content content content" / 5rem
            `,
        }}
      >
        <Header></Header>
        <Sidebar></Sidebar>
        <article style={{ gridArea: "content" }} className="p-4">
          {children}
        </article>
      </main>
    </>
  );
};
