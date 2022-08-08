import { manifestation } from "@duxcore/manifestation";
import { apiError, errorConstructor } from "../../../helpers/apiError";
import { sendApiErrors } from "../../../helpers/sendApiErrors";
import { services } from "../../../lib/services";

export const serviceTypesRouter = manifestation.newRouter({
  route: "/types",
  middleware: [],
  routes: [
    manifestation.newRoute({
      route: "/",
      method: "get",
      executor: async (req, res) => {
        let data;

				const errors = apiError.createErrorStack();

        try {
            data = await services.types.fetchAll();
        } catch (e) {
					errors.append(errorConstructor.internalServerError(e as Error))
				}

				if (errors.stack.length > 0) return sendApiErrors(res, ...errors.stack)

        return manifestation.sendApiResponse(res, {
            status: 200,
            message: "Successfully fetched projects!",
            data: data.map(d => d.toJSON()),
            successful: true,
          });
      }
    })
  ]
})