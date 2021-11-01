import React from "react";
import { PageComponent } from "../../types/PageComponent";
import { useAuth } from "../auth/useAuth";

interface HomePageProps {}

export const HomePage: PageComponent<HomePageProps> = () => {
  const { user } = useAuth();

  return <>{user ? <div>Hey {user.firstName}</div> : <div>loading</div>}</>;
};

HomePage.requiresAuth = true;
