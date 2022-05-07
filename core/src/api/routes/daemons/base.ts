import { manifestation } from "@duxcore/manifestation";
import { apiError, errorConstructor } from "../../../helpers/apiError";
import { sendApiErrors } from "../../../helpers/sendApiErrors";
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
        secret: string;
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
        secret: {
          onMissing: () =>
            errors.append(errorConstructor.missingValue("secret")),
        },
      });

      if (errors.stack.length === 0)
        await daemons
          .create({
            name: req.body.name,
            host: req.body.host,
            port: req.body.port,
            secret: req.body.secret,
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
        data: responseData,
        successful: true,
      });
    },
  }),
];
