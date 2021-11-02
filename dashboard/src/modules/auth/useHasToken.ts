import { useTokenStore } from "./useTokenStore";

export const useHasToken = () => {
  return useTokenStore((s) => !!s.accessToken);
};
