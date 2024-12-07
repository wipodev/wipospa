export class Router {
  constructor(routes, useHash = false) {
    if (!routes) {
      console.error("No routes provided");
      throw new Error("Routes must be provided");
    }
    this.routes = routes;
    this.useHash = useHash;
    this.currentPath = null;
    this.currentView = null;
  }

  getCurrentPath() {
    if (this.useHash) {
      return window.location.hash.slice(1) || "/";
    }
    return window.location.pathname;
  }

  navigateTo(path) {
    const newPath = this.useHash ? `#${path}` : path;

    if (this.useHash) {
      if (window.location.hash !== newPath) {
        window.location.hash = newPath;
      }
    } else {
      if (window.location.pathname !== path) {
        window.history.pushState({}, path, window.location.origin + path);
      }
    }

    this.loadRoute();
  }

  loadRoute() {
    const newPath = this.getCurrentPath();

    if (newPath === this.currentPath) {
      return;
    }
    this.currentPath = newPath;

    const route = this.routes[newPath] || this.routes["/"];
    if (route) {
      const selector = document.querySelector(route.selector);

      if (this.currentView && typeof this.currentView.unmount === "function") {
        this.currentView.unmount();
      }

      const view = new route.component();
      view.mount(selector, true);

      this.currentView = view;
    } else {
      console.error(`Route for ${newPath} not found.`);
    }
  }

  interceptLinks() {
    document.body.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (link && link.href.startsWith(window.location.origin)) {
        event.preventDefault();
        const path = link.getAttribute("href");
        if ((path && path.startsWith("/")) || path.startsWith("#")) {
          this.navigateTo(this.useHash ? path.replace("#", "") : path);
        }
      }
    });
  }

  init() {
    if (this.routes.layout) {
      const layout = new this.routes.layout();
      layout.mount(document.body, true);
    }

    if (this.useHash) {
      window.addEventListener("hashchange", this.loadRoute.bind(this));
    } else {
      window.addEventListener("popstate", this.loadRoute.bind(this));
    }

    this.interceptLinks();
    this.loadRoute();
  }
}
