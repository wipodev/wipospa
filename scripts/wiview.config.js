export const config = {
  layout: "/wiview/app/layout.html",
  routes: {
    "/wiview/": {
      component: "/wiview/app/views/home.html",
    },
    "/wiview/about": {
      component: "/wiview/app/views/about.html",
    },
  },
  selector: "main",
};
