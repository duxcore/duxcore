import { manifestation } from "@duxcore/manifestation";
import { apiError, errorConstructor } from "../../../helpers/apiError";
import { sendApiErrors } from "../../../helpers/sendApiErrors";
import { daemonRegions } from "../../../lib/daemonRegions";
import { dataValidator } from "../../../util/dataValidator";

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
