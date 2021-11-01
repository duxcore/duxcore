export const API_BASEURL =
  process.env.NEXT_PUBLIC_API_BASEURL || "http://localhost:3609/v1";

export const isProd = process.env.NODE_ENV === "production";

// LocalStorage keys
export const ACCESS_TOKEN_KEY = "@duxcore/access";
export const INTENDED_PATH_KEY = "@duxcore/next";
