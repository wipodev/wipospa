export const config = {
  layout: "/views/layout.html",
  routes: {
    "/": {
      component: "/views/home.html",
    },
    "/about": {
      component: "/views/about.html",
    },
    "/contact": {
      component: "/views/contact.html",
    },
  },
  selector: "main",
};
