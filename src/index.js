import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "hono/bun";

// utils
import { handleError, res } from "./util/response";

// endpoints
import fileRoutes from "./routes/files";

const api = new Hono();

// add cors to all endpoints
api.use("*", cors());
api.onError(handleError);

// routes
api.route("/files", fileRoutes);

const app = new Hono();

app.route("/api", api);
app.use("*", serveStatic({ root: "./src/web" }));

export default {
	port: 8080,
	fetch: app.fetch,
};
