import { manifestation, MiddlewareMethod } from "@duxcore/manifestation";
import { apiError } from "../../helpers/apiError";
import { sendApiErrors } from "../../helpers/sendApiErrors";
import { authorizationToken } from "../../lib/authorizationTokens";
import { users } from "../../lib/users";

export const authorizeAdministratorRequest: MiddlewareMethod = async (
  req,
  res,
  next
) => {
  let authToken = req.headers.authorization;

  if (!authToken)
    return manifestation.sendApiResponse(
      res,
      manifestation.newApiResponse({
        status: 400,
        message: "An error has occured",
        data: {
          errors: apiError.createErrorStack("missingAuthToken").stack,
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

  const usr = await users.fetch(tokenMeta.userId);

  if (!usr?.isAdministrator)
    return sendApiErrors(
      res,
      ...apiError.createErrorStack({
        code: "UNAUTHORIZED_REQUEST",
        message: "You must be an administrator to use this.",
      }).stack
    );

  res.locals["tokenData"] = tokenMeta;
  return next();
};
