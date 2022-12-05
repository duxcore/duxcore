import { manifestation } from "@duxcore/manifestation";
import { apiError } from "../../../modules/apiError";
import { sendApiErrors } from "../../../modules/sendApiErrors";
import { daemons } from "../../../interfaces/daemons";
import { z } from "zod"
import { fetchTokenData } from "../../../modules/fetchTokenData";
import { authorizeAdministratorRequest } from "../../middleware/authorizeAdministrator";
import { projects } from "../../../interfaces/projects";
import { services } from "../../../interfaces/services";

export const apiServiceBaseRoutes = [
  manifestation.newRoute({
    route: "/",
    method: "post",
    middleware: [authorizeAdministratorRequest],
    executor: async (req, res) => {
      let tokenData = fetchTokenData(res.locals);
      let errors = apiError.createErrorStack();

      let input = z.object({
        name: z.string(),
        project: z.string(),
        daemon: z.string(),
        // this will probably change over time
        params: z.object({
          image: z.string(),
          bind_dir: z.string(),
          port_map: z.any(),
        }),
        cpu: z.number(),
        memory: z.number(),
        disk: z.number(),
      }).safeParse(req.body);

      if (!input.success) return sendApiErrors(res, ...input.error.issues);

      let daemon = await daemons.fetch(input.data.daemon);

      if (!daemon) {
        errors.append('invalidDaemonId')
        return sendApiErrors(res, ...errors.stack);
      }

      // TODO: Validate daemon resources

      let canUseProject = await projects.checkUserPermission(tokenData.userId, input.data.project);

      if (!canUseProject) {
        errors.append('invalidProjectId')
        return sendApiErrors(res, ...errors.stack);
      }

      let service = await services.create({
        name: input.data.name,
        projectId: input.data.project,
        daemonId: input.data.daemon,
        params: input.data.params,
        cpu: input.data.cpu,
        mem: input.data.memory,
        disk: input.data.disk,
      })

      if (!service) {
        errors.append('serviceCreationFailed')
        return sendApiErrors(res, ...errors.stack);
      }

      // @todo: rebuild this so we can pass things without having to do this
      // @todo: implement cpu, memory and disk
      try {
        await daemon.server.createService({
          type: 'raw',
          params: {
            id: service.id,
            image: input.data.params['image'],
            bind_dir: input.data.params['bind_dir'],
            port_map: input.data.params['port_map'],
          },
        })
      } catch (e) {
        console.log(e)
        errors.append({
          code: 'internalServerError',
          message: 'Unable to create service on daemon. It may be offline or not responding.',
        })
        return sendApiErrors(res, ...errors.stack);
      }

      return manifestation.sendApiResponse(res, {
        status: 200,
        message: "Successfully created service.",
        // quick patch because we don't have a service class yet
        data: service,
        successful: true,
      });
    },
  }),
];
