import React from "react";
import { PageComponent } from "../../types/PageComponent";
import { useAuth } from "../auth/useAuth";

interface HomePageProps {}

export const HomePage: PageComponent<HomePageProps> = () => {
  const { user, logOut } = useAuth();

  return (
    <div>
      <div>Hey {user?.firstName}</div>
      <button
        onClick={() => logOut()}
        className="py-0.5 mt-5 ml-3 px-2 bg-gray-800 hover:bg-gray-700 rounded-5"
      >
        Logout
      </button>
    </div>
  );
};

HomePage.requiresAuth = true;
