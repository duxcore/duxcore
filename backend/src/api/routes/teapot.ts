import { newApiResponse } from "../../helpers/newApiResponse";
import { sendApiResponse } from "../../helpers/sendApiResponse";
import { ApiRoute } from "../../types/api";

export const teapot: ApiRoute = {
  route: "/teapot",
  method: "get",
  middleware: [],
  executor: (req, res) => {
    const response = newApiResponse({
      status: 418,
      message: "I'm a teapot",
    });
    sendApiResponse(res, response);
  },
};
