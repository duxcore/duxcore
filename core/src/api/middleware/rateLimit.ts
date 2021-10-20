import { manifestation } from "@duxcore/manifestation";
import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 1000,
  max: 3,
  handler: (req, res) => {
    const response = manifestation.newApiResponse({
      status: 429,
      message: "You have been rate limited...",
      successful: false,
    });
    manifestation.sendApiResponse(res, response);
  },
});
