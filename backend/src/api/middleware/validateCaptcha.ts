import * as Express from "express";
import { verify } from "hcaptcha";
import { newApiResponse } from "../../helpers/newApiResponse";
import { sendApiResponse } from "../../helpers/sendApiResponse";

export const validateCaptcha = (
  req: Express.Request,
  res: Express.Response,
  next: () => void
) => {
  const token = req.headers.CaptchaToken?.toString() ?? "";
  const secret = process.env.CAPTCHA_SECRET ?? "";

  console.log("test 1");
  verify(token, secret)
    .then((response) => {
      console.log("test 2");
      if (response.success) {
        return next();
      }

      return sendApiResponse(
        res,
        newApiResponse({
          status: 403,
          message: "Invalid captcha",
          successful: false,
        })
      );
    })
    .catch((err) => {
      sendApiResponse(
        res,
        newApiResponse({
          status: 500,
          message:
            "An error has occured whilst trying to validate the captcha...",
          data: {
            err: err.message,
          },
          successful: false,
        })
      );
    });
};
