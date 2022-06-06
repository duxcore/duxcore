import { manifestation } from "@duxcore/manifestation";
import { projects } from "../../lib/projects";
import { users } from "../../lib/users";

export const apiStats = manifestation.newRoute({
  route: "/stats",
  method: "get",
  executor: async (req, res) => {
    const data = {
      users: {
        totalCount: await users.count(),
      },
      services: {
        totalCount: null,
        project: {
          totalCount: await projects.count(),
        },
      },
    };

    const response = manifestation.newApiResponse({
      status: 200,
      message: "Successfuly fetched duxcore stats.",
      data,
      successful: true,
    });

    manifestation.sendApiResponse(res, response);
  },
});
