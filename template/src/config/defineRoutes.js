import Layout from "../app/Layout.html";
import Home from "../app/views/Home.html";
import About from "../app/views/About.html";

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
