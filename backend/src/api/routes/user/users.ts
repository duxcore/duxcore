import { newApiResponse } from "../../../helpers/newApiResponse";
import { sendApiResponse } from "../../../helpers/sendApiResponse";
import { ApiRoute } from "../../../types/api";
import { validateCaptcha } from "../../middleware/validateCaptcha";

export const users: ApiRoute[] = [
  {
    route: "/user",
    method: "post",
    middleware: [validateCaptcha],
    executor: (req, res) => {},
  },
];
