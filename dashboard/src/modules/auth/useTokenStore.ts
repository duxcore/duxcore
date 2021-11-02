import create from "zustand";
import { combine } from "zustand/middleware";
import { ACCESS_TOKEN_KEY } from "../../lib/constants";
import { isServer } from "../../lib/isServer";

const getDefaultValues = () => {
  if (!isServer) {
    try {
      return {
        accessToken: localStorage.getItem(ACCESS_TOKEN_KEY) || "",
      };
    } catch {}
  }

  return {
    accessToken: "",
  };
};

export const useTokenStore = create(
  combine(getDefaultValues(), (set) => ({
    setToken: (x: { accessToken: string }) => {
      try {
        localStorage.setItem(ACCESS_TOKEN_KEY, x.accessToken);
      } catch {}

      set(x);
    },
  }))
);
