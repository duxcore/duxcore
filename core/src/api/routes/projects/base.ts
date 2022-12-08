import { manifestation } from "@duxcore/manifestation";
import ProjectManager from "../../../classes/ProjectManager";
import { apiError, errorConstructor } from "../../../modules/apiError";
import { fetchTokenData } from "../../../modules/fetchTokenData";
import { sendApiErrors } from "../../../modules/sendApiErrors";
import { projects } from "../../../interfaces/projects";
import { dataValidator } from "../../../modules/dataValidator";
import { z } from "zod";
import ServiceManager from "../../../classes/ServiceManager";
import { services } from "../../../interfaces/services";

export const projectBaseRoutes = [
  manifestation.newRoute({
    route: "/",
    method: "get",
    executor: async (req, res) => {
      const tokenData = fetchTokenData(res.locals);
      const errors = apiError.createErrorStack();
      let responseData;

      if (errors.stack.length === 0)
        await projects
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
        message: "Successfully fetched projects!",
        data: responseData,
        successful: true,
      });
    },
  }),
  manifestation.newRoute({
    route: "/",
    method: "post",
    executor: async (req, res) => {
      let tokenData = fetchTokenData(res.locals);
      let errors = apiError.createErrorStack();
      let newProject;

      let input = z.object({
        name: z.string(),
      }).safeParse(req.body);

      if (!input.success)
        return sendApiErrors(res, ...input.error.issues);

      let { name } = input.data;

      if (errors.stack.length === 0)
        await projects
          .create(name, tokenData.userId)
          .then(async (v) => (newProject = await v.toJson()))
          .catch((e) => errors.append(errorConstructor.internalServerError(e)));

      if (errors.stack.length > 0) return sendApiErrors(res, ...errors.stack);

      return manifestation.sendApiResponse(res, {
        status: 200,
        message: "Successfully created new project!",
        data: newProject,
        successful: true,
      });
    },
  }),
  manifestation.newRoute({
    route: "/:project",
    method: "get",
    executor: async (req, res) => {
      let tokenData = fetchTokenData(res.locals);

      let input = z.object({
        project: z.string().uuid(),
      }).safeParse(req.params);

      if (!input.success)
        return sendApiErrors(res, ...input.error.issues);

      let projectId = input.data.project;

      let errors = apiError.createErrorStack();

      const project = await projects.fetch(projectId);

      if (!project) errors.append("invalidProjectId");
      if (
        !!project &&
        !(await projects.checkUserPermission(tokenData.userId, projectId))
      )
        errors.append("projectNoAccess");

      if (errors.stack.length > 0) return sendApiErrors(res, ...errors.stack);
      return manifestation.sendApiResponse(res, {
        status: 200,
        message: "Successfully fetched project!",
        data: await project?.toJson(),
        successful: true,
      });
    },
  }),

  manifestation.newRoute({
    route: "/:project/services",
    method: "get",
    executor: async (req, res) => {
      let tokenData = fetchTokenData(res.locals);
      let errors = apiError.createErrorStack();

      let input = z.object({ project: z.string() }).safeParse(req.params)
      if (!input.success) return sendApiErrors(res, ...input.error.issues);

      let project = await projects.fetch(input.data.project)

      if (!project) errors.append("invalidProjectId");
      if (project?.creator !== tokenData.userId) errors.append("projectNoAccess")

      if (errors.stack.length > 0) {
        return sendApiErrors(res, ...errors.stack);
      }
      
      let serviceList: ServiceManager[] = []

      let projectServices = await services.fetchAllByProject(input.data.project)
      if (projectServices) {
        serviceList.push(...projectServices.values())
      }

      return manifestation.sendApiResponse(res, {
        status: 200,
        message: "Successfully fetched all services in the project.",
        data: serviceList.map(s => s.toJson()),
        successful: true,
      });
    },
  }),
];
