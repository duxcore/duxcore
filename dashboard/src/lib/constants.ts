export const API_BASEURL =
  process.env.NEXT_PUBLIC_API_BASEURL || "http://localhost/v1";

export const isProd = process.env.NODE_ENV === "production";
export const REFRESH_EXCLUDE_LIST: string[] = [];

// LocalStorage keys
export const AUTH_TOKEN_KEY = "@duxcore/auth-token";
export const REFRESH_TOKEN_KEY = "@duxcore/refresh-token"
export const INTENDED_PATH_KEY = "@duxcore/next";
