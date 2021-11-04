import { useRouter } from "next/dist/client/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Preloader } from "../../components/PreLoader";
import { useAxios } from "../../context/AxiosProvider";
import axiosInstance from "../../lib/axiosInstance";
import { API_BASEURL } from "../../lib/constants";
import { extractErrors } from "../extractErrors";
import { useHasToken } from "./useHasToken";
import { useTokenStore } from "./useTokenStore";

// Need shared types, this is messy

export type User = {
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
  revokeAllRefreshTokens: () => void;
}>({
  user: null,
  logOut: () => { },
  setUser: () => { },
  revokeAllRefreshTokens: () => { }
});

interface AuthProviderProps {
  requiresAuth: boolean;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  requiresAuth,
  children,
}) => {
  const hasTokens = useHasToken();
  const [user, setUser] = useState<User["data"]["user"] | null>(null);
  const [authComplete, setAuthComplete] = useState(false);
  const { replace, asPath } = useRouter();
  const axios = useAxios();

  useEffect(() => {
    if (!hasTokens && requiresAuth) {
      console.log("triggered");
      replace(`/login?next=${asPath}`).then(() => {
        setAuthComplete(true);
      });
      return;
    }

    if (!user && hasTokens) {
      // Our instance will add the token to the
      // Authorization header automatically
      axios
        .get<User>(`${API_BASEURL}/users/@me`)
        .then((x) => {
          setUser(x.data.data.user);
        })
        .catch((err) => {
          if (err.response.status === 401 && requiresAuth) {
            const errs = extractErrors(err.response.data.data.errors);
            if (errs.has("AUTH_FAILURE")) {
              useTokenStore.getState().setTokens({ authToken: "", refreshToken: "" });
              replace(`/login?next=${window.location.pathname}`);
            }
          }
        })
        .finally(() => {
          setAuthComplete(true);
        });
      return;
    }

    setAuthComplete(true);
  });


  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({
          user,
          logOut: () => {
            const { setTokens: setToken } = useTokenStore.getState();
            setToken({ authToken: "", refreshToken: "" });
            setUser(null);
            location.href = window.location.origin;
          },
          setUser: (u) => {
            setUser(u);
          },
          revokeAllRefreshTokens: () => {
            axiosInstance.delete(`${API_BASEURL}/users/@me/revokeAllRefreshTokens`)
              .then(res => {
                const { setTokens: setToken } = useTokenStore.getState();
                setToken({ authToken: "", refreshToken: "" });
                setUser(null);
              });
          }
        }),
        [user]
      )}
    >
      <Preloader active={!authComplete}>{children}</Preloader>
    </AuthContext.Provider>
  );
};
