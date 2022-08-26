import { manifestation } from "@duxcore/manifestation";
import ServiceTypeManager from "../../../classes/ServiceTypeManager";
import { apiError, errorConstructor } from "../../../helpers/apiError";
import { fetchTokenData } from "../../../helpers/fetchTokenData";
import { sendApiErrors } from "../../../helpers/sendApiErrors";
import { services, CreateFeatureData } from "../../../lib/services";
import { dataValidator } from "../../../util/dataValidator";
import { authorizeAdministratorRequest } from "../../middleware/authorizeAdministrator";
import { authorizeRequest } from "../../middleware/authorizeRequest";

export const serviceTypesRouter = manifestation.newRouter({
  route: "/services/types",
  middleware: [authorizeRequest],
  routes: [
    manifestation.newRoute({
      route: "/",
      method: "get",
      executor: async (req, res) => {
        let data: ServiceTypeManager[] = [];

        const errors = apiError.createErrorStack();

        try {
          data = await services.types.fetchAll();
        } catch (e) {
          errors.append(errorConstructor.internalServerError(e as Error));
        }

        if (errors.stack.length > 0) return sendApiErrors(res, ...errors.stack);

        return manifestation.sendApiResponse(res, {
          status: 200,
          message: "Successfully fetched service types!",
          data: data.map((d) => d.toJson()),
          successful: true,
        });
      },
    }),
    manifestation.newRoute({
      route: "/",
      method: "post",
      middleware: [authorizeAdministratorRequest],
      executor: async (req, res) => {
        const errors = apiError.createErrorStack();
        let data;

        await dataValidator<{
          name: string;
          features: string[];
        }>(req.body, {
          name: {
            onMissing: () =>
              errors.append(errorConstructor.missingValue("name")),
          },
          features: {
            async validator(v) {
              const features = await Promise.all(
                v.map(async (f) => {
                  const fV = await services.features.fetch(f, true);

                  if (!fV) errors.append(errorConstructor.invalidFeatureID(f));
                  return fV;
                })
              );

              req.body.features = features;
              return true;
            },
            onMissing: () =>
              errors.append(errorConstructor.missingValue("features")),
          },
        });

        if (errors.stack.length === 0) {
          try {
            data = await services.types.create(
              req.body.name,
              req.body.features
            );
          } catch (e) {
            console.error(e);
            errors.append(errorConstructor.internalServerError(e as Error));
          }
        }

        if (errors.stack.length > 0) return sendApiErrors(res, ...errors.stack);
        if (!data) return;

        return manifestation.sendApiResponse(res, {
          status: 200,
          message: "Successfully created service!",
          data: data.toJson(),
          successful: true,
        });
      },
    }),
    manifestation.newRoute({
      route: "/:type",
      method: "get",
      executor: async (req, res) => {
        const errors = apiError.createErrorStack();

        let type = await services.types.fetch(req.params.type as string);

        if (!type) errors.append("unknownServiceType");
        if (errors.stack.length > 0) return sendApiErrors(res, ...errors.stack);
        if (!type) return;

        return manifestation.sendApiResponse(res, {
          status: 200,
          message: "Successfully fetched service type!",
          data: type.toJson(),
          successful: true,
        });
      },
    }),
  ],
});
