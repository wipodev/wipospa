import { render } from "./renderEngine.js";

export const Router = (routes) => {
  if (!routes) {
    console.log(routes);
    console.error("No routes provided");
    return;
  }

  const navigateTo = (path) => {
    window.history.pushState({}, path, window.location.origin + path);
    loadRoute();
  };

  const loadRoute = () => {
    const path = window.location.pathname;
    const route = routes[path] || routes["/"];

    if (route) {
      const selector = document.querySelector(route.selector);
      render(route.component, selector);
    } else {
      console.error(`Route for ${path} not found.`);
    }
  };

  const interceptLinks = () => {
    document.body.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (link && link.href.startsWith(window.location.origin)) {
        event.preventDefault();
        const path = link.getAttribute("href");
        if (path && path.startsWith("/")) {
          navigateTo(path);
        }
      }
    });
  };

  const init = () => {
    if (routes.layout) render(routes.layout);
    window.addEventListener("popstate", loadRoute);
    interceptLinks();
    loadRoute();
  };

  return { init };
};
