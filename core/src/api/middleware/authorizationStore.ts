import { manifestation, MiddlewareMethod, WebsocketMiddlewareMethod } from "@duxcore/manifestation";
import { apiError } from "../../modules/apiError";
import { authorizationToken } from "../../interfaces/authorizationTokens";
import * as Express from "express"

export interface AuthorizationStore {
    hasToken: boolean;
    authToken?: string;
    authTokenValid?: boolean;
    userId?: string;
}

/**
 * !!!!!!
 * 
 * ONLY USE WITH WEBSOCKET REQUESTS
 * 
 * !!!!!!!
 */
export const authorizationStore = (request: Express.Request, next) => {
  console.log("test")

  // \/ GETS STUCK HERE \/
  const authToken = request.headers.Authorization as string;

  /**
   * This is really just here to deal with the Typescript errors, it serves no real function
   */
  const req: Express.Request & {authorizationStore: AuthorizationStore} = 
  request as (Express.Request & {authorizationStore: AuthorizationStore});

  console.log("test")


  if (!authToken) {
      req.authorizationStore = { hasToken: (!!authToken), authTokenValid: false }
      return next();
  }

  let tokenMeta = authorizationToken.validateToken(authToken);

  if (!tokenMeta) {
    req.authorizationStore = { hasToken: (!!authToken), authTokenValid: !!tokenMeta }
    return next();
  }

  req.authorizationStore = {
    hasToken: !!authToken,
    authToken: authToken,
    authTokenValid: !!tokenMeta,
    userId: tokenMeta.userId
  }

  return next();
};
