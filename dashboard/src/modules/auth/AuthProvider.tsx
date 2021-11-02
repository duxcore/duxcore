import { useRouter } from "next/dist/client/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAxios } from "../../context/AxiosProvider";
import { API_BASEURL } from "../../lib/constants";
import { useHasToken } from "./useHasToken";
import { useTokenStore } from "./useTokenStore";
import { WaitForAuth } from "./WaitForAuth";

// Need shared types, this is messy

type User = {
  data: {
    user: {
      id: string;
      email: string;
      created: Date;
      firstName: string;
      lastName: string;
    };
  };
};

export const AuthContext = React.createContext<{
  user: User["data"]["user"] | null;
  logOut: () => void;
  setUser: (u: User["data"]["user"]) => void;
}>({
  user: null,
  logOut: () => {},
  setUser: () => {},
});

interface AuthProviderProps {
  requiresAuth: boolean;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  requiresAuth,
  children,
}) => {
  const hasToken = useHasToken();
  const [user, setUser] = useState<User["data"]["user"] | null>(null);
  const { replace } = useRouter();
  const isAuthenticating = useRef(false);
  const axios = useAxios();

  useEffect(() => {
    if (!user && !isAuthenticating.current && hasToken) {
      isAuthenticating.current = true;

      // Our instance will add the token to the
      // Authorization header automatically
      axios
        .get<User>(`${API_BASEURL}/users/@me`)
        .then((x) => {
          setUser(x.data.data.user);
        })
        .catch((err) => {
          if (err.status === 401 && requiresAuth) {
            useTokenStore.getState().setToken({ accessToken: "" });
            replace(`/login?next=${window.location.pathname}`);
          }
        })
        .finally(() => {
          isAuthenticating.current = false;
        });
    }
  }, [axios, hasToken, replace, requiresAuth, user]);

  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({
          user,
          logOut: () => {
            const { setToken } = useTokenStore.getState();
            setToken({ accessToken: "" });
            setUser(null);

            // Here you would call /logout and invalidate the refresh token family

            location.href = window.location.origin;
          },
          setUser: (u) => {
            setUser(u);
          },
        }),
        [user]
      )}
    >
      {requiresAuth ? <WaitForAuth>{children}</WaitForAuth> : children}
    </AuthContext.Provider>
  );
};
