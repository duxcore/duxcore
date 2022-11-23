import { manifestation } from "@duxcore/manifestation";
import { apiError, errorConstructor } from "../../modules/apiError";
import { authorizationToken } from "../../interfaces/authorizationTokens";

export const authRoutes = [
  manifestation.newRoute({
    route: "/auth/refresh",
    method: "post",
    executor: (req, res) => {
      let refreshToken = req.headers.authorization;

      if (!refreshToken) manifestation.sendApiResponse(res, manifestation.newApiResponse({
        status: 400,
        message: "Missing refresh token",
        data: {
          errors: apiError.createErrorStack("missingRefreshToken").stack
        },
        successful: false
      }));

      authorizationToken.refreshAuthToken(refreshToken).then((tokenPair) => {
        return manifestation.sendApiResponse(res, manifestation.newApiResponse({
          status: 200,
          message: "Successfully refreshed authorization tokens",
          data: tokenPair,
          successful: true
        }));
      }).catch(err => {
        return manifestation.sendApiResponse(res, manifestation.newApiResponse({
          status: 401,
          message: "An error has occured.",
          data: {
            errors: apiError.createErrorStack(err)
          },
          successful: false
        }));
      })
    }
  })
]