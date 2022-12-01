import { manifestation } from "@duxcore/manifestation";
import { Daemon } from "@prisma/client";
import { apiError, errorConstructor } from "../../../modules/apiError";
import { sendApiErrors } from "../../../modules/sendApiErrors";
import { daemonRegions } from "../../../interfaces/daemonRegions";
import { daemons } from "../../../interfaces/daemons";
import { dataValidator } from "../../../modules/dataValidator";
import { formatDiscriminator } from "../../../modules/formatDiscriminator";
import { z } from "zod"

export const apiDaemonBaseRoutes = [
  manifestation.newRoute({
    route: "/",
    method: "post",
    executor: async (req, res) => {
      let errors = apiError.createErrorStack();
      let responseData;

      let input = z.object({
        name: z.string().min(1).max(32),
        host: z.string(),
        port: z.number().min(1).max(65535),
        secure: z.boolean(),
        wsPort: z.string(),
        secret: z.string(),
        region: z.string(),
        regionDiscriminator: z.string(),
        resourceCeil: z.object({
          cpu: z.number(),
          memory: z.number(),
          disk: z.number(),
        })
      }).safeParse(req.body);

      if (!input.success)
        return sendApiErrors(res, ...input.error.issues);

      let { name, host, port, secure, wsPort, secret, region, regionDiscriminator, resourceCeil } = input.data;

      if (!await daemonRegions.exists(region))
        errors.append("unknownDaemonRegion");

      if (await daemons.regionDiscriminatorInUse(formatDiscriminator(regionDiscriminator), region))
        errors.append("regionDiscriminatorInUse");

      if (errors.stack.length === 0)
        await daemons
          .create({
            name,
            host,
            port,
            wsPort,
            secure,
            secret,
            regionId: region,
            regionDiscriminator,
            resourceCeil,
          })
          .then((res) => {
            responseData = res.toJson();
            return;
          })
          .catch((e) => {
            errors.append({
              code: "INTERNAL_SERVER_ERROR",
              message: e.message,
            });
          });

      if (errors.stack.length > 0) return sendApiErrors(res, ...errors.stack);

      return manifestation.sendApiResponse(res, {
        status: 200,
        message: "Seccussfully created daemon.",
        data: await responseData,
        successful: true,
      });
    },
  }),
  manifestation.newRoute({
    route: "/:id",
    method: "get",
    executor: async (req, res) => {
      let errors = apiError.createErrorStack();
      let responseData;

      let input = z.object({
        id: z.string()
      }).safeParse(req.params);

      if (!input.success)
        return sendApiErrors(res, ...input.error.issues);

      let { id } = input.data;

      if (!await daemons.exists(id))
        errors.append("invalidDaemonId");
        
      let data = await daemons.fetch(id)

      // this should never trigger, it's just for type safety, or ig weird database errors
      if (!data) errors.append("invalidDaemonId");

      if (errors.stack.length > 0) return sendApiErrors(res, ...errors.stack);

      return manifestation.sendApiResponse(res, {
        status: 200,
        message: "Successfully fetched daemond.",
        data,
        successful: true,
      });
    },
  }),
  manifestation.newRoute({
    route: "/:id",
    method: "patch",
    executor: async (req, res) => {
      let errors = apiError.createErrorStack();
      let patchData: Partial<Daemon> = {};
      let responseData;

      let id = z.string().safeParse(req.params.id);

      if (!id.success) return sendApiErrors(res, ...id.error.issues);

      let input = z.object({
        id: z.string(),
        name: z.string().min(1).max(32),
        regionDiscriminator: z.string(),
        port: z.string(),
        wsPort : z.string(),
        secure: z.boolean(),
        secret: z.string(),
      }).partial().safeParse(req.body);

      if (!input.success) return sendApiErrors(res, ...input.error.issues);

      patchData = input.data;
      let code: string | undefined = undefined;

      let calledDaemon = await daemons.fetch(id.data);
      if (!calledDaemon) errors.append("invalidDaemonId");

      if (patchData.regionDiscriminator && await daemons.regionDiscriminatorInUse(
        formatDiscriminator(patchData.regionDiscriminator),
        (await calledDaemon?.region)?.id as string
      )) errors.append("regionDiscriminatorInUse");
      else if (patchData.regionDiscriminator) {
        patchData.regionDiscriminator = formatDiscriminator(patchData.regionDiscriminator);
        code = `${(await calledDaemon?.region)?.code}-${patchData.regionDiscriminator}`
      }

      if (errors.stack.length === 0)
        responseData = await daemons
          .apiPatch(req.params.id, patchData)
          .catch((err) => {
            errors.append({
              code: "INTERNAL_SERVER_ERROR",
              message: err.message,
            });
          });

      if (errors.stack.length > 0)
        return await sendApiErrors(res, ...errors.stack);

      if (!calledDaemon) return;

      return manifestation.sendApiResponse(res, {
        status: 200,
        message: "Successfully Patched Daemon Data",
        data: await responseData.toJson(),
        successful: true,
      });
    },
  }),
];
