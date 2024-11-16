import Layout from "../Layout.html";
import Home from "./home.html";
import About from "./about.html";

export const routes = {
  layout: Layout,
  "/": {
    component: Home,
    selector: "main",
  },
  "/about": {
    component: About,
    selector: "main",
  },
};
