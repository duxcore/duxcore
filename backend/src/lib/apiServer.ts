import express, { Router as expressRouter } from "express";
import { apiManifest } from "../api/manifest";
import { newApiResponse } from "../helpers/newApiResponse";
import { sendApiResponse } from "../helpers/sendApiResponse";

export default function startApiServer(port: number) {
  const app = express();
  const versions = apiManifest.versions;

  versions.map((v, index) => {
    const versionTag = `/v${v.version}`;
    const router = expressRouter();

    if (v.middleware.length !== 0 && !!v.middleware) router.use(...v.middleware);

    // Map through all of the routes and call them.
    v.routes.map((route) => {
      const executor = route.executor;

      // Setup Route
      router[route.method](route.route, ...route.middleware, executor);
    });

    app.use(versionTag, router);
  });

  setTimeout(() => {
    app.all("*", (req, res) => {
      const response = newApiResponse({
        status: 404,
        message: "Unknown Route...",
        successful: false,
      });

      sendApiResponse(res, response);
    });

    app.listen(port, () => console.log("API webserver started on port", port));
  }, 1);
}
