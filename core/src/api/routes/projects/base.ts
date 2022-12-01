import { manifestation } from "@duxcore/manifestation";
import ProjectManager from "../../../classes/ProjectManager";
import { apiError, errorConstructor } from "../../../modules/apiError";
import { fetchTokenData } from "../../../modules/fetchTokenData";
import { sendApiErrors } from "../../../modules/sendApiErrors";
import { projects } from "../../../interfaces/projects";
import { dataValidator } from "../../../modules/dataValidator";
import { z } from "zod";

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
        name: z.string().min(1).max(32),
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
];
