import { manifestation } from "@duxcore/manifestation";
import { apiError, errorConstructor } from "../../../../helpers/apiError";
import { fetchTokenData } from "../../../../helpers/fetchTokenData";
import { sendApiErrors } from "../../../../helpers/sendApiErrors";
import { monitoring } from "../../../../lib/monitoring";
import { serviceCollection } from "../../../../lib/serviceCollections";
import { authorizeRequest } from "../../../middleware/authorizeRequest";
import { monitorRouter } from "../monitors";

export const serverMonitorsRouter = manifestation.newRouter({
  route: "/servers",
  routes: [
    manifestation.newRoute({
      route: "/",
      method: "get",
      middleware: [authorizeRequest],
      executor: async (req, res) => {
        let tokenData = fetchTokenData(res.locals);
        let userId = tokenData.userId

        return manifestation.sendApiResponse(res, {
          status: 200,
          data: (await monitoring.server.fetchUserMonitors(userId)).map(m => m.toJson()),
          message: "Successfully fetched server monitors!",
          successful: true
        });
      },
    }),
    manifestation.newRoute({
      route: "/",
      method: "post",
      middleware: [authorizeRequest],
      executor: async (req, res) => {
        let tokenData = fetchTokenData(res.locals);
        let userId = tokenData.userId;

        let errors = apiError.createErrorStack();

        req.body.name ?? errors.append(errorConstructor.missingValue("name"));
        req.body.collectionId ?? errors.append(errorConstructor.missingValue("collectionId"));

        const collection = await serviceCollection.fetch(req.body.collectionId);

        if (!collection) errors.append("invalidServiceCollectionId");

        if (errors.stack.length > 0) return sendApiErrors(res, ...errors.stack);

        let newCollection = await monitoring.server.create({
          name: req.body.name,
          creator: userId,
          collection: req.body.collectionId
        });

        return manifestation.sendApiResponse(res, {
          status: 201,
          data: newCollection.toJson(),
          message: "Successfully created new monitor",
          successful: true
        })
      }
    })
  ],
  routers: []
})