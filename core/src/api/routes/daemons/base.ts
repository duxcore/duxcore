import { manifestation } from "@duxcore/manifestation";
import { apiError, errorConstructor } from "../../../helpers/apiError";
import { sendApiErrors } from "../../../helpers/sendApiErrors";
import { daemonRegions } from "../../../lib/daemonRegions";
import { daemons } from "../../../lib/daemons";
import { dataValidator } from "../../../util/dataValidator";

export const apiDaemonBaseRoutes = [
  manifestation.newRoute({
    route: "/",
    method: "post",
    executor: async (req, res) => {
      let errors = apiError.createErrorStack();
      let responseData;

      await dataValidator<{
        name: string;
        host: string;
        port: number | string;
        secure: boolean;
        wsPort: string | number;
        secret: string;
        region: string;
      }>(req.body, {
        name: {
          validators: [],
          onMissing: () => errors.append(errorConstructor.missingValue("name")),
        },
        host: {
          onMissing: () => errors.append(errorConstructor.missingValue("host")),
        },
        port: {
          onMissing: () => errors.append(errorConstructor.missingValue("port")),
        },
        wsPort: {
          onMissing: () =>
            errors.append(errorConstructor.missingValue("wsPort")),
        },
        secure: {
          onMissing: () =>
            errors.append(errorConstructor.missingValue("secure")),
        },
        secret: {
          onMissing: () =>
            errors.append(errorConstructor.missingValue("secret")),
        },
        region: {
          validator: async (v) => {
            return await daemonRegions.exists(v);
          },
          onFail: async (v) => {
            return errors.append("unknownDaemonRegion");
          },
          onMissing: () =>
            errors.append(errorConstructor.missingValue("region")),
        },
      });

      if (errors.stack.length === 0)
        await daemons
          .create({
            name: req.body.name,
            host: req.body.host,
            port: req.body.port,
            wsPort: req.body.wsPort,
            secure: req.body.secure,
            secret: req.body.secret,
            regionId: req.body.region,
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

      await dataValidator<{ id: string }>(req.params as any, {
        id: {
          validator: async (v) => {
            let daemonData = await daemons.fetch(v);

            if (!daemonData) return "invalidDaemonId";
            responseData = daemonData.toJson();
            return true;
          },
          onFail: (err) => {
            errors.append(err);
          },
        },
      });

      if (errors.stack.length > 0) return sendApiErrors(res, ...errors.stack);
      return manifestation.sendApiResponse(res, {
        status: 200,
        message: "Successfully fetched daemond.",
        data: await responseData,
        successful: true,
      });
    },
  }),
];
