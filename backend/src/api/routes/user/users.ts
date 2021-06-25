import { newApiResponse } from "../../../helpers/newApiResponse";
import { sendApiResponse } from "../../../helpers/sendApiResponse";
import { createUser } from "../../../lib/users";
import { ApiRoute } from "../../../types/api";
import { validateCaptcha } from "../../middleware/validateCaptcha";

export const users: ApiRoute[] = [
  {
    route: "/user",
    method: "post",
    middleware: [validateCaptcha],
    executor: (req, res) => {
      createUser(req.body.data)
        .then((user) => {
          sendApiResponse(
            res,
            newApiResponse({
              status: 201,
              message: "User created successfully!",
              successful: true,
            })
          );
        })
        .catch((err) => {
          sendApiResponse(
            res,
            newApiResponse({
              status: 500,
              message:
                "An error has occured whilst attempting to create a user",
              data: {
                error: err.message,
              },
              successful: false,
            })
          );
        });
    },
  },
];
