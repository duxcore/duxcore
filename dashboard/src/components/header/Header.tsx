import React from "react";
import { useAuth } from "../../modules/auth/useAuth";

interface HeaderProps { }

export const Header: React.FC<HeaderProps> = ({ children }) => {
  const { user, logOut } = useAuth();

  return (
    <div className="w-full h-10 bg-black border-b border-gray-800 border-solid">
      {children}
    </div>
  );
};
