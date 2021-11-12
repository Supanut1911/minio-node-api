import fastify from "fastify";
import fastifyRoutes from "fastify-routes";
import cors from "fastify-cors";
import helmet from "fastify-helmet";

import { routes } from "./routes/uploadRoutes";
const PORT = parseInt(<string>process.env.MINIO_NODE_API_PORT, 10) || 3000;

const fileUpload = require("fastify-file-upload");
const caching = require("fastify-caching");
const boom = require("fastify-boom");
const app = fastify({
  logger: false,
});

const cacheMaxAge = 7 * 24 * 60 * 60; // 7 Day
app.register(helmet, {});
app.register(fastifyRoutes);
app.register(boom);
app.register(caching, {});
app.register(cors);
app.register(fileUpload);

app.addHook("onRequest", (request, reply, done) => {
  const getImagePath = "/file/";
  if (
    request.raw?.method === "GET" &&
    request.raw.url?.includes(getImagePath)
  ) {
    reply.header("Cache-Control", `public, max-age=${cacheMaxAge}`);
  } else {
    reply.header("Cache-control", `no-store`);
  }
  done();
});

routes.forEach((route): void => {
  app.route(route);
});

const start = async () => {
  try {
    app.listen(PORT, "0.0.0.0", (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server listening at ${address}`);
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
