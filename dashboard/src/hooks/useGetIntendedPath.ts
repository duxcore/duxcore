import { useRouter } from "next/router";
import { useEffect } from "react";
import { INTENDED_PATH_KEY } from "../lib/constants";

export const useGetIntendedPath = () => {
  const { query } = useRouter();

  useEffect(() => {
    if (query.next && typeof query.next === "string") {
      try {
        localStorage.setItem(INTENDED_PATH_KEY, query.next);
      } catch {}
    }
  }, [query.next]);
};
