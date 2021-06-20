import * as Express from "express";

export type MiddlewareMethod = (
  req: Express.Request,
  res: Express.Response,
  next: () => void
) => void;

export interface ApiManifest {
  versions: ApiVersionManifest[];
}

export interface ApiRoute {
  route: string;
  method: "get" | "post" | "put" | "delete" | "patch" | "all";
  middleware: MiddlewareMethod[];
  executor: (req: Express.Request, res: Express.Response) => void;
}

export interface ApiVersionManifest {
  version: number; // what version of the api is this?
  middleware: MiddlewareMethod[];
  routes: ApiRoute[];
}

export interface ApiResponse {
  status?: number; // What is the status code returned with the api response.
  message?: string; // A message attached to the api response.
  data?: any; // The data returned with the api reponse (if any).
  successful?: boolean; // Was the api response successful?
  meta?: any; // Meta data sent along with the api response
}
