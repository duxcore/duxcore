import { useRouter } from "next/router";
import { useEffect } from "react";
import { useHasToken } from "./useHasToken";

export const useVerifiedLoggedIn = () => {
  const { replace, asPath } = useRouter();
  const hasTokens = useHasToken();

  useEffect(() => {
    if (!hasTokens) {
      replace(`/login?next=${asPath}`);
    }
  }, [asPath, hasTokens, replace]);

  return hasTokens;
};
