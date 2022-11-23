import { manifestation } from "@duxcore/manifestation";
import { apiError, errorConstructor } from "../../modules/apiError";

export const teapot = manifestation.newRoute({
  route: "/teapot",
  method: "get",
  executor: (req, res) => {
    const response = manifestation.newApiResponse({
      status: 418,
      message: "I'm not a teapot.",
      successful: true
    });

    manifestation.sendApiResponse(res, response);
  }
})