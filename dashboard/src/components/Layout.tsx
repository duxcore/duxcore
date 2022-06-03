import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../modules/auth/useAuth";
import { Header } from "./layout/Header";
import { Sidebar } from "./layout/Sidebar";
import styles from "../styles/layout.module.css";
import { useRouter } from "next/router";
import Head from "next/head";

const LayoutContext = createContext<{
  searchResults: Array<{ name: string; url: string }> | undefined;
  setSearchResults: (
    results?: Array<{ name: string; url: string }>
  ) => undefined | void;
}>({
  searchResults: undefined,
  setSearchResults: () => undefined,
});

export const useLayout = () => {
  return useContext(LayoutContext);
};

interface LayoutProps {
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { user, logOut, revokeAllRefreshTokens } = useAuth();
  const [searchResults, setSearchResults] =
    useState<Array<{ name: string; url: string }>>();

  return (
    <>
      <LayoutContext.Provider value={{ searchResults, setSearchResults }}>
        <main
          id="maincontent"
          className={`w-full p-0 bg-black grid h-screen ${styles.layout}`}
        >
          <Head>
            <title>{`Duxcore ${title ? `| ${title}` : ""} `}</title>
          </Head>
          <Header title={title}/>
          <Sidebar/>
          <article
            style={{ gridArea: "content" }}
            className="p-4 overflow-auto"
          >
            {children}
          </article>
        </main>
      </LayoutContext.Provider>
    </>
  );
};
