import React from "react";
import { useAuth } from "../modules/auth/useAuth";
import { Header } from "./header/Header";

interface LayoutProps { }

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logOut, revokeAllRefreshTokens } = useAuth();

  return (
    <>
      <Header>
        <div className="px-30">
          <h1>Welcome {user?.firstName}</h1>
          <button
            onClick={() => logOut()}
            className="py-0.5 px-2 bg-gray-800 hover:bg-gray-700 rounded-5"
          >Logout</button>
        </div>
      </Header>
      <div className="w-full p-1 bg-gray-900 px-30">
        {children}
      </div>
    </>
  );
};
