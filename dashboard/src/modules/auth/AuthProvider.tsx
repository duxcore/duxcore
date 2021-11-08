import { User } from "@duxcore/wrapper/lib/types/user";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useMemo, useState } from "react";
import { Preloader } from "../../components/PreLoader";
import { useWrapper } from "../../context/WrapperProvider";
import { extractErrors } from "../extractErrors";
import { useHasToken } from "./useHasToken";
import { useTokenStore } from "./useTokenStore";

export const AuthContext = React.createContext<{
  user: User | null;
  logOut: () => void;
  setUser: (u: User) => void;
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
  const [user, setUser] = useState<User | null>(null);
  const [authComplete, setAuthComplete] = useState(false);
  const { replace, asPath } = useRouter();
  const wrapper = useWrapper();

  useEffect(() => {
    if (!hasTokens && requiresAuth) {
      replace(`/login?next=${asPath}`).then(() => {
        setAuthComplete(true);
      });
      return;
    }

    if (!user && hasTokens) {
      wrapper.api.user.me().then(user => {
        setUser(user);
      }).catch(error => {
        if (error?.data && requiresAuth) {
          const errs = extractErrors(error.data.errors.stack);
          if (errs.has("AUTH_FAILURE")) {
            useTokenStore.getState().setTokens({ authToken: "", refreshToken: "" });
            replace(`/login?next=${window.location.pathname}`);
          }
        }
      }).finally(() => setAuthComplete(true));
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
            wrapper.api.user.revokeAllTokens().then(() => {
              const { setTokens: setToken } = useTokenStore.getState();
              setToken({ authToken: "", refreshToken: "" });
              setUser(null);
            }).catch(() => {
              // we should probably let the user know
            })
          }
        }),
        [user]
      )}
    >
      <Preloader active={!authComplete}>{children}</Preloader>
    </AuthContext.Provider>
  );
};
