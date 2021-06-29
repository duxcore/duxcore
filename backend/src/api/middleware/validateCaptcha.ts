import * as Express from "express";
import axios from "axios";
import { newApiResponse } from "../../helpers/newApiResponse";
import { sendApiResponse } from "../../helpers/sendApiResponse";

export const validateCaptcha = (
  req: Express.Request,
  res: Express.Response,
  next: () => void
) => {
  const token = (req.headers.captchatoken as string) ?? "";
  const secret = process.env.CAPTCHA_SECRET ?? "";

  console.log("test 1");
  axios
    .post(
      "https://hcaptcha.com/siteverify",
      `response=${token}&secret=${secret}`,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    )
    .then((r) => {
      console.log(r.data);
      if (r.data.success) {
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
    });
};
