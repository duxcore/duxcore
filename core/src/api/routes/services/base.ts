import { manifestation } from "@duxcore/manifestation";
import { apiError, errorConstructor } from "../../../modules/apiError";
import { sendApiErrors } from "../../../modules/sendApiErrors";
import { daemons } from "../../../interfaces/daemons";
import { z } from "zod"
import { fetchTokenData } from "../../../modules/fetchTokenData";
import { prismaInstance } from "../../../../prisma/instance";
import { authorizeAdministratorRequest } from "../../middleware/authorizeAdministrator";

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
        params: z.any(),
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

      console.log(1)

      let project = await prismaInstance.project.findUnique({
        where: {
          id: input.data.project
        }
      });

      if (!project) {
        errors.append('invalidProjectId')
        return sendApiErrors(res, ...errors.stack);
      }

      console.log(2)

      let service = await prismaInstance.service.create({
        data: {
          name: input.data.name,
          project: {  
            connect: {
              id: input.data.project,
            },
          },
          daemon: {
            connect: {
              id: input.data.daemon,
            },
          },
          // yes, ik this is bad. but we can trust that the params are valid, because they come from a serialized json request
          params: (input.data.params as any),
          cpu: input.data.cpu,
          mem: input.data.memory,
          disk: input.data.disk,
          status: 'SETTING_UP',
        }
      });

      console.log(3)

      // @todo: rebuild this so we can pass things without having to do this
      // @todo: implement cpu, memory and disk
      await daemon.server.createService({
        type: 'raw',
        params: {
          id: service.id,
          image: input.data.params['image'],
          bind_dir: input.data.params['bind_dir'],
          port_map: input.data.params['port_map'],
        },
      })

      console.log(4)

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
