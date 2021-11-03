import React from "react";
import { Header } from "../../components/header/Header";
import { PageComponent } from "../../types/PageComponent";
import { useAuth } from "../auth/useAuth";

interface HomePageProps { }

export const HomePage: PageComponent<HomePageProps> = () => {
  const { user, logOut } = useAuth();

  return (
    <>
      <Header>
        <div>Hey {user?.firstName}</div>
        <button
          onClick={() => logOut()}
          className="py-0.5 px-2 bg-gray-800 hover:bg-gray-700 rounded-5"
        >
          Logout
        </button>
      </Header>
      <div className="w-full h-screen bg-gray-900">
        this is thde body stuff ig
      </div>
    </>
  );
};

HomePage.requiresAuth = true;
