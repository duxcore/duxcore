import { manifestation, MiddlewareMethod } from "@duxcore/manifestation";
import { apiError } from "../../modules/apiError";
import { sendApiErrors } from "../../modules/sendApiErrors";
import { authorizationToken } from "../../interfaces/authorizationTokens";
import { z } from "zod";
import { services } from "../../interfaces/services";
import { projects } from "../../interfaces/projects";

export const hasServiceAccess: MiddlewareMethod = async (
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
  
  let input = z.object({
      service: z.string().uuid(),
    }).safeParse(req.params);

  // if service is not in the params, we don't need to check for service access
  if (!input.success) return next();

  let serviceId = input.data.service;

  const service = await services.fetch(serviceId);

  if (!service) return next()

  let project = await projects.fetch(service.project);

  if (project?.creator !== tokenMeta.userId)
    return sendApiErrors(
      res,
      ...apiError.createErrorStack({
        code: "UNAUTHORIZED_REQUEST",
        message: "You must be an owner of the project to use this.",
      }).stack
    );

  res.locals["tokenData"] = tokenMeta;
  return next();
};
