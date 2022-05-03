import { manifestation } from "@duxcore/manifestation";
import ProjectManager from "../../../classes/projectManager";
import { apiError, errorConstructor } from "../../../helpers/apiError";
import { fetchTokenData } from "../../../helpers/fetchTokenData";
import { sendApiErrors } from "../../../helpers/sendApiErrors";
import { projects } from "../../../lib/projects";

export const projectsRouter = manifestation.newRouter({
  route: "/projects",
  middleware: [],
  routes: [
    manifestation.newRoute({
      route: "/",
      method: "get",
      executor: async (req, res) => {
        const tokenData = fetchTokenData(res.locals);

        return manifestation.sendApiResponse(res, {
          status: 200,
          message: "Successfully fetched projects!",
          data: await Promise.all(
            (
              await projects.fetchAllByUser(tokenData.userId)
            ).map(async (s) => await s.toJson())
          ),
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
        let newProject: ProjectManager | null = null;

        req.body.name ?? errors.append(errorConstructor.missingValue("name"));

        if (errors.stack.length === 0)
          newProject = await projects.create(
            req.body.name as string,
            tokenData.userId
          );
        if (errors.stack.length > 0) return sendApiErrors(res, ...errors.stack);

        return manifestation.sendApiResponse(res, {
          status: 200,
          message: "Successfully created new project!",
          data: newProject?.toJson(),
          successful: true,
        });
      },
    }),
    manifestation.newRoute({
      route: "/:project",
      method: "get",
      executor: async (req, res) => {
        let tokenData = fetchTokenData(res.locals);
        let projectId = req.params.project;
        let errors = apiError.createErrorStack();

        const project = await projects.fetch(projectId);

        if (!project) errors.append("invalidProjectId");
        if (!(await projects.checkUserPermission(tokenData.userId, projectId)))
          errors.append("projectNoAccess");

        if (errors.stack.length > 0) return sendApiErrors(res, ...errors.stack);
        return manifestation.sendApiResponse(res, {
          status: 200,
          message: "Successfully fetched project!",
          data: project?.toJson(),
          successful: true,
        });
      },
    }),
  ],
});
