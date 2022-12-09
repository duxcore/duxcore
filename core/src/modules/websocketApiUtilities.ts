import { AuthorizationStore } from "../api/middleware/authorizationStore";
import { errorManifest } from "./apiError";

export const wsApiUtils = {
  extractAuthorizationStore: (request: Express.Request): AuthorizationStore => {
    const req: Express.Request & { authorizationStore: AuthorizationStore} 
    = request as (Express.Request & { authorizationStore: AuthorizationStore});

    return req.authorizationStore;
  },

  validateUserToken: async (ws: WebSocket, authStore: AuthorizationStore) => {
    const instantFailure = (!authStore || !authStore.authTokenValid)

    if (instantFailure) return ws.close(3000, JSON.stringify(errorManifest.authFailure));

    return;
  }
}