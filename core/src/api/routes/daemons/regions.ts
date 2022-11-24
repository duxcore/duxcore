import { manifestation } from "@duxcore/manifestation";
import { apiError, errorConstructor } from "../../../modules/apiError";
import { sendApiErrors } from "../../../modules/sendApiErrors";
import { daemonRegions } from "../../../interfaces/daemonRegions";
import { dataValidator } from "../../../modules/dataValidator";

export const daemonRegionRoutes = manifestation.newRouter({
  route: "/regions",
  routes: [
    manifestation.newRoute({
      route: "/",
      method: "post",
      executor: async (req, res) => {
        let errors = apiError.createErrorStack();
        let responseData;

        await dataValidator<{
          code: string;
          name: string;
        }>(req.body, {
          name: {
            onMissing: () =>
              errors.append(errorConstructor.missingValue("name")),
          },
          code: {
            validator: async (v) => await daemonRegions.checkCodeAvailable(v),
            onFail: () => errors.append("regionCodeUnavailable"),
            onMissing: () =>
              errors.append(errorConstructor.missingValue("code")),
          },
        });

        if (errors.stack.length === 0)
          responseData = (
            await daemonRegions.create({
              name: req.body.name,
              code: req.body.code,
            })
          ).toJson();

        if (errors.stack.length > 0) return sendApiErrors(res, ...errors.stack);

        return manifestation.sendApiResponse(res, {
          status: 200,
          message: "Successfully created new daemon region.",
          data: responseData,
          successful: true,
        });
      },
    }),
  ],
});
