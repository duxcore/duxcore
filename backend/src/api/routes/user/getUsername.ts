import { newApiResponse } from "../../../helpers/newApiResponse";
import { sendApiResponse } from "../../../helpers/sendApiResponse";
import { ApiResponse, ApiRoute } from "../../../types/api";
import { prisma } from "../../../util/prisma/instance";

export const getUsername: ApiRoute = {
  route: "/user/username/:username",
  method: "get",
  middleware: [],
  executor: (req, res) => {
    const username = req.params.username

    prisma.user.findFirst({ where: { username } }).then(user => {
      let response: ApiResponse;

      if (!user) {
        response = newApiResponse({
          status: 404,
          message: "No user by this username exists...",
          data: {
            isTaken: false,
            username,
            timestamp: new Date().getTime()
          },
          successful: true
        });
      } else {
        response = newApiResponse({
          status: 200,
          message: "User exists.",
          data: {
            isTaken: true,
            username,
            timestamp: new Date().getTime()
          },
          successful: true
        });
      }

      return sendApiResponse(res, response);
    });
  },
};
