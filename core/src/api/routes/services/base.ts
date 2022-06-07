import { manifestation } from "@duxcore/manifestation";
import { apiError, errorConstructor } from "../../../helpers/apiError";
import { fetchTokenData } from "../../../helpers/fetchTokenData";
import { sendApiErrors } from "../../../helpers/sendApiErrors";
import { services } from "../../../lib/services";

export const baseServicesRoutes = [
  manifestation.newRoute({
    route: "/",
    method: "get",
    executor: async (req, res) => {
      const tokenData = fetchTokenData(res.locals);
      const errors = apiError.createErrorStack();
      let responseData;

      if (errors.stack.length === 0)
        await services
          .fetchAllByUser(tokenData.userId)
          .then(async (v) => {
            responseData = await Promise.all(
              v.map(async (s) => await s.toJson())
            );
          })
          .catch((e) => errors.append(errorConstructor.internalServerError(e)));

      if (errors.stack.length > 0) return sendApiErrors(res, ...errors.stack);

      return manifestation.sendApiResponse(res, {
        status: 200,
        message: "Successfully fetched services!",
        data: responseData,
        successful: true,
      });
    },
  }),
];
