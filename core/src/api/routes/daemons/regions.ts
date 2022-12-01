import { manifestation } from "@duxcore/manifestation";
import { apiError, errorConstructor } from "../../../modules/apiError";
import { sendApiErrors } from "../../../modules/sendApiErrors";
import { daemonRegions } from "../../../interfaces/daemonRegions";
import { z } from "zod"

export const daemonRegionRoutes = manifestation.newRouter({
  route: "/regions",
  routes: [
    manifestation.newRoute({
      route: "/",
      method: "post",
      executor: async (req, res) => {
        let errors = apiError.createErrorStack();
        let responseData;

        let input = z.object({
          name: z.string(),
          code: z.string(),
        }).safeParse(req.body);

        if (!input.success) return sendApiErrors(res, ...input.error.issues);

        let { name, code } = input.data;

        if (!await daemonRegions.checkCodeAvailable(code)) errors.append("regionCodeUnavailable");

        if (errors.stack.length === 0)
          responseData = (
            await daemonRegions.create({
              name,
              code,
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
