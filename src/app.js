import { createApp as createNonSSRApp, createSSRApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { router } from "./router";
import { registerComponents } from "./components/common/components";
import "./assets/scss/app.scss";

/**
 * "createApp" will be used for both client.ts and server.ts.
 * App will be rendered to the server-side then it will be sent to the client-side for hydration process.
 * Vue will run the same app on the client-side or in the browser, matches it with the server-side, then making it interactive.
 */
const createApp = async () => {
  const isSSR = typeof window === "undefined";
  const app = (isSSR === true ? createSSRApp : createNonSSRApp)(App);

  // Register the Global Components here
  await registerComponents(app);
  app.use(createPinia());
  app.use(router(isSSR));
  return app;
};

export default createApp;
