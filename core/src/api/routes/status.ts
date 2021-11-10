import { manifestation } from "@duxcore/manifestation";
import { users } from "../../lib/users";

export const apiStatus = manifestation.newRoute({
  route: "/status",
  method: "get",
  executor: async (req, res) => {
    users.fetch("06a6b1b0-80cf-47de-b32b-81937997fe5c").then(usr => usr?.updateEmail("jrobe3221@gmail.com"));
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