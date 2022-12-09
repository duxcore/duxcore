import { WebsocketMiddlewareMethod } from "@duxcore/manifestation";
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
export const wsAuthorizeRequest: WebsocketMiddlewareMethod = (socket: WebSocket, request: Express.Request, next: () => void) => {
  const authToken = request.headers.authorization as string;

  // This is really just here to deal with the Typescript errors, it serves no real function
  const req = request as (Express.Request & {authorizationStore: AuthorizationStore});

  if (!authToken) {
    socket.close(1, "No authorization token provided")
    return next();
  }

  let tokenMeta = authorizationToken.validateToken(authToken);

  if (!tokenMeta) {
    socket.close(1, "Invalid authorization token provided")
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
