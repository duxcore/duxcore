import { manifestation } from "@duxcore/manifestation";
import ServiceTypeManager from "../../../classes/ServiceTypeManager";
import { apiError, errorConstructor } from "../../../helpers/apiError";
import { sendApiErrors } from "../../../helpers/sendApiErrors";
import { services } from "../../../lib/services";

export const serviceTypesRouter = manifestation.newRouter({
  route: "/services/types",
  middleware: [],
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
          message: "Successfully fetched services!",
          data: type.toJson(),
          successful: true,
        });
      },
    }),
  ],
});
