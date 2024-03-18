import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import express from "express";
import { createServer as createViteServer } from "vite";

dotenv.config();

const DEBUG = false;
const DEFAULT_PORT = 3002;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "../..");

async function createServer() {
  const app = express();

  /*
    Create Vite server in middleware mode and config the app type as "custom",
    disabling Vite's own HTML serving logic so parent server can take control.
    */
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  /*
    Use Vite's connect instance as middleware. If you use your own express router
    (express.Router()), you should use router.use.
    */
  app.use(vite.middlewares);

  const apiRouter = express.Router();
  apiRouter.use(express.urlencoded({ extended: true }));
  apiRouter.use(express.json());
  apiRouter.use((_, res, next) => {
    res.set({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH",
      "Content-Type": "application/json; charset=utf-8",
    });
    next();
  });

  // const CONTROLLER_DIR = path.resolve(ROOT_DIR, "src/controllers");
  //   for (const controllerFile of fs.readdirSync(CONTROLLER_DIR)) {
  //     console.log(controllerFile.length);
  //     const routePath = controllerFile.replace(".controller.js", "");
  //     const controller = await import(`${CONTROLLER_DIR}/${controllerFile}`);
  //     controller.default(`/${routePath}`, apiRouter);
  //   }

  // Root API route for health check.
  apiRouter.get("/", (_, res) => res.send("API Default"));

  // Handle unknown routes not existing in controller(s).
  apiRouter.use((_, res) => res.status(404).send("API Route Not Found"));

  // Debug API routes
  if (DEBUG) console.log(apiRouter.stack);

  // All API routes will be prefixed with '/api'.
  app.use("/api", apiRouter);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // 1. Read index.html depending on app environment
      const templatePath = process.env.APP_ENVIRONMENT === "production" ? path.resolve(ROOT_DIR, "dist/client/index.html") : path.resolve(ROOT_DIR, "index.html");
      let template = fs.readFileSync(templatePath, "utf-8");

      // 2. Apply Vite HTML transforms. This injects the Vite HMR client, and
      //    also applies HTML transforms from Vite plugins like @vitejs/plugin-react.
      template = await vite.transformIndexHtml(url, template);

      // 3. Load the server entry. ssrLoadModule auto transforms ESM source code
      //    to be usable in Node.js. There is no bundling required; similar to HMR.
      const entryServerPath = process.env.APP_ENVIRONMENT === "production" ? "/dist/server/entry-server.js" : "/src/entry-server.js";
      const { render } = await vite.ssrLoadModule(entryServerPath);

      // 4. Render the app HTML. This assumes entry-server.js's exported `render`
      //    function calls appropriate framework SSR APIs.
      const appHtml = await render();

      // 5. Inject the app-rendered HTML into the template.
      const html = template.replace(`<!--ssr-outlet-->`, appHtml);

      // 6. Send the final HTML.
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      // If an error is caught, let Vite fix the stacktrace so it appears to be
      // coming from the original source file.
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  app.listen(process.env.APP_SERVER_PORT || DEFAULT_PORT, () => {
    console.log(`Server running at http://localhost:${process.env.APP_SERVER_PORT || DEFAULT_PORT}`);
  });
}

createServer();
