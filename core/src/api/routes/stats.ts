import { manifestation } from "@duxcore/manifestation";
import { monitoring } from "../../lib/monitoring";
import { serviceCollection } from "../../lib/serviceCollections";
import { users } from "../../lib/users";

export const apiStats = manifestation.newRoute({
  route: "/stats",
  method: "get",
  executor: async (req, res) => {
    const data = {
      server: process.env.server,
      users: {
        totalCount: await users.count()
      },
      services: {
        totalCount: null,
        serverMonitors: {
          totalCount: await monitoring.server.count()
        },
        collections: {
          totalCount: await serviceCollection.count()
        }
      }
    }

    const response = manifestation.newApiResponse({
      status: 200,
      message: "Successfuly fetched duxcore stats.",
      data,
      successful: true
    });

    manifestation.sendApiResponse(res, response);
  }
})