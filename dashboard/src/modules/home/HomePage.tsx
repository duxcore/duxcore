import React from "react";
import { Header } from "../../components/header/Header";
import { PageComponent } from "../../types/PageComponent";
import { useAuth } from "../auth/useAuth";

interface HomePageProps { }

export const HomePage: PageComponent<HomePageProps> = () => {
  const { user, logOut, revokeAllRefreshTokens } = useAuth();

  return (
    <>
      <Header>
        <div className="flex content-center justify-center text-center">
          <h1>Hey {user?.firstName}</h1>
        </div>
      </Header>
      <div className="w-full h-screen p-1 bg-gray-900">
        <div className="flex gap-1">
          <button
            onClick={() => logOut()}
            className="py-0.5 px-2 bg-gray-800 hover:bg-gray-700 rounded-5"
          >Logout</button>
          <button
            onClick={() => revokeAllRefreshTokens()}
            className="py-0.5 px-2 bg-gray-800 hover:bg-gray-700 rounded-5"
          >Revoke All Refresh Tokens</button>
        </div>
      </div>
    </>
  );
};

HomePage.requiresAuth = true;
