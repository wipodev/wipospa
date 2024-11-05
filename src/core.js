const evaluateScripts = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  const scripts = tempDiv.querySelectorAll("script");
  scripts.forEach((script) => {
    const newScript = document.createElement("script");
    newScript.type = "module";
    if (script.src) {
      newScript.src = script.src;
    } else {
      newScript.textContent = script.textContent;
    }
    document.body.appendChild(newScript).parentNode.removeChild(newScript);
  });

  return tempDiv.innerHTML.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
};

export const loadComponent = async (options = {}) => {
  const { component, selector, initFunction = null, replaceContent = true, fetchOptions = {} } = options;

  try {
    const response = await fetch(component, fetchOptions);
    if (!response.ok) {
      throw new Error(`Failed to load component: ${component}`);
    }
    let content = await response.text();
    content = evaluateScripts(content);
    const container = document.querySelector(selector);

    if (container) {
      container.innerHTML = replaceContent ? content : container.innerHTML + content;
      if (initFunction) {
        await initFunction();
      }
    } else {
      console.warn(`Selector not found: ${selector}`);
      document.querySelector("body").innerHTML = replaceContent ? content : container.innerHTML + content;
      if (initFunction) {
        await initFunction();
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const Router = (options) => {
  const { layout = null, routes = null, selector = "body" } = options;

  const navigateTo = (path) => {
    window.history.pushState({}, path, window.location.origin + path);
    handleRoute();
  };

  const handleRoute = () => {
    const path = window.location.pathname;
    const route = routes ? routes[path] : null;

    if (route) {
      loadComponent({
        component: route.component,
        selector,
        replaceContent: true,
        initFunction: route.initFunction,
      });
    } else {
      document.querySelector(selector).innerHTML = `
      <h1>404 Not Found</h1>
      <p>The page you're looking for does not exist.</p>
    `;
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
    if (layout) {
      loadComponent({
        component: layout,
        selector: "body",
        replaceContent: true,
        initFunction: () => {
          interceptLinks();
          handleRoute();
          window.addEventListener("popstate", handleRoute);
        },
      });
    } else {
      interceptLinks();
      handleRoute();
      window.addEventListener("popstate", handleRoute);
    }
  };

  return { init };
};
