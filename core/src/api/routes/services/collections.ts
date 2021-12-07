import { manifestation } from "@duxcore/manifestation";
import ServiceCollectionManager from "../../../classes/ServiceCollectionManager";
import { apiError, errorConstructor } from "../../../helpers/apiError";
import { fetchTokenData } from "../../../helpers/fetchTokenData";
import { sendApiErrors } from "../../../helpers/sendApiErrors";
import { serviceCollection } from "../../../lib/serviceCollections";

export const collectionsRouter = manifestation.newRouter({
  route: "/collections",
  middleware: [],
  routes: [
    manifestation.newRoute({
      route: "/",
      method: "get",
      executor: async (req, res) => {
        const tokenData = fetchTokenData(res.locals);

        return manifestation.sendApiResponse(res, {
          status: 200,
          message: "Successfully fetched service collections!",
          data: await Promise.all((await serviceCollection.fetchAllByUser(tokenData.userId)).map(async s => await s.toJson())),
          successful: true
        })
      }
    }),
    manifestation.newRoute({
      route: "/",
      method: "post",
      executor: async (req, res) => {
        let tokenData = fetchTokenData(res.locals);
        let errors = apiError.createErrorStack();
        let newCollection: ServiceCollectionManager | null = null;

        req.body.name ?? errors.append(errorConstructor.missingValue("name"));

        if (errors.stack.length === 0) newCollection = await serviceCollection.create(req.body.name as string, tokenData.userId);
        if (errors.stack.length > 0) return sendApiErrors(res, ...errors.stack);

        return manifestation.sendApiResponse(res, {
          status: 200,
          message: "Successfully created new collection!",
          data: newCollection?.toJson(),
          successful: true
        })
      }
    }),
    manifestation.newRoute({
      route: "/:collection",
      method: "get",
      executor: async (req, res) => {
        let tokenData = fetchTokenData(res.locals);
        let collectionId = req.params.collection;
        let errors = apiError.createErrorStack();

        const collection = await serviceCollection.fetch(collectionId);

        if (!collection) errors.append("invalidServiceCollectionId");
        if (!(await serviceCollection.checkUserPermission(tokenData.userId, collectionId))) errors.append("collectionNoAccess");

        if (errors.stack.length > 0) return sendApiErrors(res, ...errors.stack);
        return manifestation.sendApiResponse(res, {
          status: 200,
          message: "Successfully fetched collection!",
          data: collection?.toJson(),
          successful: true
        })
      }
    })
  ]
})