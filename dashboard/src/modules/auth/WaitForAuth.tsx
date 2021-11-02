import React from "react";
import { useAuth } from "./useAuth";
import { useVerifiedLoggedIn } from "./useVerifiedLoggedIn";

interface WaitForAuthProps {}

export const WaitForAuth: React.FC<WaitForAuthProps> = ({ children }) => {
  const { user } = useAuth();

  if (!useVerifiedLoggedIn()) {
    return null;
  }

  if (!user) {
    // This can be way better
    return <div>loading...</div>;
  }

  return <>{children}</>;
};
