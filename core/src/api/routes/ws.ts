import { manifestation } from "@duxcore/manifestation";
import { authorizationToken } from "../../interfaces/authorizationTokens";
import { fetchTokenData } from "../../modules/fetchTokenData";
import { authorizeRequest } from "../middleware/authorizeRequest";

export const wsRoute = manifestation.newWebsocketRoute({
  route: "/ws",
  middleware: [],
  executor: (ws, req) => {
    let authToken = req.headers.authorization;
    if (!authToken) return ws.close(3000);

    let validatedToken = authorizationToken.validateToken(authToken);
    if (!validatedToken) return ws.close(3000);

    console.log("Client connected");
    ws.send("Connected Successfully.");
    ws.send(JSON.stringify(validatedToken));
    ws.close;
  },
});
