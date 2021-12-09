import React from "react";
import { Header } from "../../components/layout/Header";
import { Layout, useLayout } from "../../components/Layout";
import { CollectionsArray } from "../../components/serviceCollections/CollectionsArray";
import { PageComponent } from "../../types/PageComponent";
import { useAuth } from "../auth/useAuth";
import Head from "next/head";

interface HomePageProps {}

export const HomePage: PageComponent<HomePageProps> = () => {
  const { revokeAllRefreshTokens } = useAuth();

  /*
        <button
        onClick={() => revokeAllRefreshTokens()}
        className="py-0.5 px-2 bg-gray-800 hover:bg-gray-700 rounded-5"
      >Revoke All Refresh Tokens</button>
      */

  return (
    <>
      <CollectionsArray />
    </>
  );
};

HomePage.requiresAuth = true;

HomePage.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};
