import { manifestation, MiddlewareMethod } from "@duxcore/manifestation";
import { apiError } from "../../modules/apiError";
import { authorizationToken } from "../../interfaces/authorizationTokens";

export const authorizeRequest: MiddlewareMethod = (req, res, next) => {
  let authToken = req.headers.authorization;

  // check if websocket request
  if (!authToken && req.headers["sec-websocket-protocol"]) {
    authToken = req.headers["sec-websocket-protocol"];
  }

  if (!authToken)
    return manifestation.sendApiResponse(
      res,
      manifestation.newApiResponse({
        status: 400,
        message: "An error has occured",
        data: {
          errors: apiError.createErrorStack("missingAuthToken"),
        },
        successful: false,
      })
    );

  let tokenMeta = authorizationToken.validateToken(authToken);

  if (!tokenMeta)
    return manifestation.sendApiResponse(
      res,
      manifestation.newApiResponse({
        status: 401,
        message: "Authorization failure.",
        data: {
          errors: apiError.createErrorStack("authFailure").stack,
        },
        successful: false,
      })
    );

  res.locals["tokenData"] = tokenMeta;
  return next();
};
