import { loadComponent } from "/lib/wi.js";

const routes = {
  "/": {
    component: "home",
    initFunction: () => console.log("Home page loaded"),
  },
  "/about": {
    component: "about",
    initFunction: () => console.log("About page loaded"),
  },
  "/contact": {
    component: "contact",
    initFunction: () => console.log("Contact page loaded"),
  },
};

const navigateTo = (path) => {
  window.history.pushState({}, path, window.location.origin + path);
  handleRoute();
};

const handleRoute = () => {
  const path = window.location.pathname;
  const route = routes[path];

  if (route) {
    loadComponent({
      component: route.component,
      selector: "main",
      replaceContent: true,
      initFunction: route.initFunction,
    });
  } else {
    document.querySelector("main").innerHTML = `
      <h1>404 Not Found</h1>
      <p>The page you're looking for does not exist.</p>
    `;
  }
};

const interceptLinks = () => {
  document.body.addEventListener("click", (event) => {
    if (event.target.tagName === "A" && event.target.href.startsWith(window.location.origin)) {
      event.preventDefault();
      const path = event.target.getAttribute("href");
      navigateTo(path);
    }
  });
};

window.addEventListener("load", () => {
  interceptLinks();
  handleRoute();
  window.addEventListener("popstate", handleRoute);
});
