import { createMemoryHistory, createRouter, createWebHistory } from "vue-router";
import PageHome from "../pages/PageHome.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: PageHome,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../pages/PageAbout.vue"),
  },
];

export const router = isSSR =>
  createRouter({
    history: (isSSR === true ? createMemoryHistory : createWebHistory)(),
    routes,
  });
