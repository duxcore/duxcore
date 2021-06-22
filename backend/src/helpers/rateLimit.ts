import rateLimit from "express-rate-limit";
import { newApiResponse } from "./newApiResponse";
import { sendApiResponse } from "./sendApiResponse";

export const apiLimiter = rateLimit({
  windowMs: 1000,
  max: 5,
  handler: (req, res) => {
    const response = newApiResponse({
      status: 429,
      message: "You have been rate limited...",
      successful: false,
    });
    sendApiResponse(res, response);
  },
});
