import create from "zustand";
import { combine } from "zustand/middleware";
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../modules/constants";
import { isServer } from "../modules/isServer";

const getDefaultValues = () => {
  if (!isServer) {
    try {
      return {
        authToken: localStorage.getItem(AUTH_TOKEN_KEY) || "",
        refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) || "",
      };
    } catch { }
  }

  return {
    authToken: "",
    refreshToken: "",
  };
};

export const useTokenStore = create(
  combine(getDefaultValues(), (set) => ({
    setTokens: (x: { authToken: string; refreshToken: string }) => {
      try {
        localStorage.setItem(AUTH_TOKEN_KEY, x.authToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, x.refreshToken);
      } catch { }

      set(x);
    },
  }))
);
