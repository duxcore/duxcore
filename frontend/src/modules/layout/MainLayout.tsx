import React from "react";

interface MainLayoutProps {}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return <div className="w-full flex">{children}</div>;
};
