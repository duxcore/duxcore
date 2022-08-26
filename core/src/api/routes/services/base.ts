import { manifestation } from "@duxcore/manifestation";
import { apiError, errorConstructor } from "../../../helpers/apiError";
import { fetchTokenData } from "../../../helpers/fetchTokenData";
import { sendApiErrors } from "../../../helpers/sendApiErrors";
import { projects } from "../../../lib/projects";
import { services } from "../../../lib/services";
import { dataValidator } from "../../../util/dataValidator";

export const baseServicesRoutes = [
  manifestation.newRoute({
    route: "/",
    method: "get",
    executor: async (req, res) => {
      const tokenData = fetchTokenData(res.locals);
      const errors = apiError.createErrorStack();
      let responseData;

      if (errors.stack.length === 0)
        await services
          .fetchAllByUser(tokenData.userId)
          .then(async (v) => {
            responseData = await Promise.all(
              v.map(async (s) => await s.toJson())
            );
          })
          .catch((e) => errors.append(errorConstructor.internalServerError(e)));

      if (errors.stack.length > 0) return sendApiErrors(res, ...errors.stack);

      return manifestation.sendApiResponse(res, {
        status: 200,
        message: "Successfully fetched services!",
        data: responseData,
        successful: true,
      });
    },
  }),

  manifestation.newRoute({
    route: "/:service",
    method: "get",
    executor: async (req, res) => {
      const tokenData = fetchTokenData(res.locals);
      const errors = apiError.createErrorStack();

      let service = await services.fetch(req.params.service as string);

      if (!service) errors.append("unknownService");
      if (
        service &&
        !(await services.checkUserPermission(tokenData.userId, service.id))
      )
        errors.append("serviceNoAccess");

      if (errors.stack.length > 0) return sendApiErrors(res, ...errors.stack);

      return manifestation.sendApiResponse(res, {
        status: 200,
        message: "Successfully fetched service!",
        data: await service?.toJson(),
        successful: true,
      });
    },
  }),
  manifestation.newRoute({
    route: "/",
    method: "post",
    executor: async (req, res) => {
      const tokenData = fetchTokenData(res.locals);
      const errors = apiError.createErrorStack();
      let responseData;

      await dataValidator<{
        name: string;
        type: string;
        project: string;
      }>(req.body, {
        name: {
          onMissing: () => errors.append(errorConstructor.missingValue("name")),
        },
        type: {
          validator: async (v) => {
            if (!(await services.types.exists(v))) return false;
            return true;
          },
          onFail: (reason, v) => errors.append(reason ?? "unknownServiceType"),
          onMissing: () => errors.append(errorConstructor.missingValue("type")),
        },
        project: {
          validator: async (v) => {
            if (!(await projects.fetch(v))) return "invalidProjectId";
            if (!(await projects.checkUserPermission(tokenData.userId, v)))
              return "projectNoAccess";

            return true;
          },
          onFail: (reason, v) => errors.append(reason ?? "invalidProjectId"),
          onMissing: () =>
            errors.append(errorConstructor.missingValue("project")),
        },
      });

      if (errors.stack.length == 0)
        await services
          .create(
            {
              name: req.body.name,
              type: req.body.type,
              project: req.body.project,
            },
            tokenData.userId
          )
          .then(async (v) => {
            responseData = await v.toJson();
          })
          .catch((e) => errors.append(errorConstructor.internalServerError(e)));

      if (errors.stack.length > 0) return sendApiErrors(res, ...errors.stack);

      return manifestation.sendApiResponse(res, {
        status: 200,
        message: "Successfully created service!",
        data: responseData,
        successful: true,
      });
    },
  }),
];
