import { manifestation } from "@duxcore/manifestation";
import { Daemon } from "@prisma/client";
import { apiError, errorConstructor } from "../../../modules/apiError";
import { sendApiErrors } from "../../../modules/sendApiErrors";
import { daemonRegions } from "../../../interfaces/daemonRegions";
import { daemons } from "../../../interfaces/daemons";
import { dataValidator } from "../../../modules/dataValidator";
import { formatDiscriminator } from "../../../modules/formatDiscriminator";

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
        regionDiscriminator: string;
        resourceCeil: {
          cpu: number;
          memory: number;
          disk: number;
        };
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
        regionDiscriminator: {
          validator: async (v) => {
            if (
              await daemons.regionDiscriminatorInUse(
                formatDiscriminator(v),
                req.body.region
              )
            )
              return "regionDiscriminatorInUse";

            req.body.regionDiscriminator = formatDiscriminator(v);
            return true;
          },
          onFail: async (err) => errors.append(err),
          onMissing: () =>
            errors.append(errorConstructor.missingValue("regionDiscriminator")),
        },
        resourceCeil: {
          validator: async (v) =>
            await dataValidator(v, {
              cpu: {
                validator: (v) => typeof v == "number",
                onFail: (err, v) =>
                  errors.append(
                    errorConstructor.invalidValueType(
                      "resourceCeil.cpu",
                      typeof v,
                      "number"
                    )
                  ),
                onMissing: () =>
                  errors.append(
                    errorConstructor.missingValue("resourceCeil.cpu")
                  ),
              },
              memory: {
                validator: (v) => typeof v == "number",
                onFail: (err, v) =>
                  errors.append(
                    errorConstructor.invalidValueType(
                      "resourceCeil.memory",
                      typeof v,
                      "number"
                    )
                  ),
                onMissing: () =>
                  errors.append(
                    errorConstructor.missingValue("resourceCeil.memory")
                  ),
              },
              disk: {
                validator: (v) => typeof v == "number",
                onFail: (err, v) =>
                  errors.append(
                    errorConstructor.invalidValueType(
                      "resourceCeil.disk",
                      typeof v,
                      "number"
                    )
                  ),
                onMissing: () =>
                  errors.append(
                    errorConstructor.missingValue("resourceCeil.disk")
                  ),
              },
            }),
          onMissing: () =>
            errors.append(errorConstructor.missingValue("resourceCeil")),
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
            regionDiscriminator: req.body.regionDiscriminator,
            resourceCeil: req.body.resourceCeil,
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
  manifestation.newRoute({
    route: "/:id",
    method: "patch",
    executor: async (req, res) => {
      let errors = apiError.createErrorStack();
      let patchData: Partial<Daemon> = {};
      let responseData;

      let calledDaemon = await daemons.fetch(req.params.id);
      if (!calledDaemon) errors.append("invalidDaemonId");

      await dataValidator<{
        name: string;
        regionDiscriminator: string;

        port: string;
        wsPort: string;
        secure: boolean;
        secret: string;
      }>(
        req.body,
        {
          name: {
            onSuccess: (v) => {
              patchData.name = v;
              return;
            },
          },
          port: {
            onSuccess: (v) => {
              patchData.port = v;
              return;
            },
          },
          wsPort: {
            onSuccess: (v) => {
              patchData.wsPort = v;
              return;
            },
          },
          secure: {
            onSuccess: (v) => {
              patchData.secure = v;
              return;
            },
          },
          secret: {
            onSuccess: (v) => {
              patchData.secret = v;
              return;
            },
          },
          regionDiscriminator: {
            validator: async (v) => {
              if (
                await daemons.regionDiscriminatorInUse(
                  formatDiscriminator(v),
                  (
                    await calledDaemon?.region
                  )?.id as string
                )
              )
                return "regionDiscriminatorInUse";

              patchData.regionDiscriminator = formatDiscriminator(v);
              patchData.code = `${(await calledDaemon?.region)?.code}-${
                patchData.regionDiscriminator
              }`;
              return true;
            },
            onFail: (err) => errors.append(err),
          },
        },
        {
          onUnexpectedValue: (k, v) =>
            errors.append(errorConstructor.unexpectedValue(k)),
          emptyData: () => errors.append("emptyRequestObject"),
        }
      );

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
