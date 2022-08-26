import { manifestation } from "@duxcore/manifestation";
import { apiError, errorConstructor } from "../../../helpers/apiError";
import { sendApiErrors } from "../../../helpers/sendApiErrors";
import { CreateFeatureData, services } from "../../../lib/services";
import { dataValidator } from "../../../util/dataValidator";
import { authorizeAdministratorRequest } from "../../middleware/authorizeAdministrator";
import { authorizeRequest } from "../../middleware/authorizeRequest";

export const serviceFeaturesRouter = manifestation.newRouter({
  route: "/services/features",
  middleware: [authorizeRequest],
  routes: [
    manifestation.newRoute({
      route: "/",
      method: "get",
      executor: async (req, res) => {
        const errors = apiError.createErrorStack();
        let data;

        if (errors.stack.length === 0) {
          try {
            data = await services.features.fetchAll(true);
          } catch (e) {
            errors.append(errorConstructor.internalServerError(e as Error));
          }
        }

        if (errors.stack.length > 0) return sendApiErrors(res, ...errors.stack);
        if (!data) return;

        return manifestation.sendApiResponse(res, {
          status: 200,
          message: "Successfully fetched features!",
          data: data.map((d) => d.toJson()),
          successful: true,
        });
      },
    }),
    manifestation.newRoute({
      route: "/:feature",
      method: "get",
      executor: async (req, res) => {
        const errors = apiError.createErrorStack();

        let feature = await services.features.fetch(
          req.params.feature as string
        );

        if (!feature) errors.append("unknownServiceFeature");
        if (errors.stack.length > 0) return sendApiErrors(res, ...errors.stack);
        if (!feature) return;

        return manifestation.sendApiResponse(res, {
          status: 200,
          message: "Successfully fetched feature!",
          data: feature.toJson(),
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

        await dataValidator<CreateFeatureData>(req.body, {
          name: {
            onMissing: () =>
              errors.append(errorConstructor.missingValue("name")),
          },
          description: {
            onMissing: () =>
              errors.append(errorConstructor.missingValue("description")),
          },
          requiresValue: {
            onMissing: () =>
              errors.append(errorConstructor.missingValue("requiresValue")),
            validator: (v) => typeof v === "boolean",
            onFail: () =>
              errors.append(
                errorConstructor.invalidValueType(
                  "requiresValue",
                  typeof req.body.requiresValue,
                  "boolean"
                )
              ),
          },
        });

        if (errors.stack.length === 0) {
          try {
            data = await services.features.create(req.body);
          } catch (e) {
            errors.append(errorConstructor.internalServerError(e as Error));
          }
        }

        if (errors.stack.length > 0) return sendApiErrors(res, ...errors.stack);
        if (!data) return;

        return manifestation.sendApiResponse(res, {
          status: 200,
          message: "Successfully created feature!",
          data: data.toJson(),
          successful: true,
        });
      },
    }),
  ],
});
