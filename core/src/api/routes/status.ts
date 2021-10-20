import { manifestation } from "@duxcore/manifestation";
import { users } from "../../lib/users";

export const apiStatus = manifestation.newRoute({
  route: "/status",
  method: "get",
  executor: async (req, res) => {
    const data = {
      users: {
        totalCount: await users.count()
      }
    }

    const response = manifestation.newApiResponse({
      status: 200,
      message: "Successfuly fetched duxcore status.",
      data,
      successful: true
    });

    manifestation.sendApiResponse(res, response);
  }
})