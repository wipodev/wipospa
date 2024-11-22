const renderHead = (head) => {
  if (!head) return;
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = head;
  Array.from(tempDiv.children).forEach((element) => {
    const tagName = element.tagName.toLowerCase();
    if (tagName === "title") {
      document.title = element.textContent;
    } else if (tagName === "meta") {
      updateMeta(element);
    } else {
      updateHeadElement(element);
    }
  });
};
function updateMeta(element) {
  const existingMeta = document.querySelector(`meta[name="${element.getAttribute("name")}"]`);
  if (existingMeta) {
    existingMeta.setAttribute("content", element.getAttribute("content"));
  } else {
    document.head.appendChild(element);
  }
}
function updateHeadElement(element) {
  const existingElement = document.head.querySelector(element.tagName.toLowerCase());
  if (existingElement) {
    existingElement.replaceWith(element);
  } else {
    document.head.appendChild(element);
  }
}
function renderStyles(styles) {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(styles);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
}
const renderScripts = (scripts) => {
  if (scripts.length > 0) {
    scripts.forEach((script) => {
      const scriptElement = document.createElement("script");
      scriptElement.type = "module";
      scriptElement.textContent = script;
      document.head.appendChild(scriptElement);
      document.head.removeChild(scriptElement);
    });
  }
};
const interpolateTemplate = (component, props) => {
  for (const key in props) {
    if (props.hasOwnProperty(key)) {
      const propKey = new RegExp(`{${key}}`, "gi");
      component = component.replace(propKey, (match) => props[key]);
    }
  }
  return component;
};
const processSubcomponents = (htmlString) => {
  const parser = new DOMParser();
  let doc = parser.parseFromString(htmlString, "text/html");
  let hasNestedComponents = true;
  const componetsMounted = [];
  while (hasNestedComponents) {
    hasNestedComponents = false;
    const components = getAllTemplates();
    Object.keys(components).forEach((componentName) => {
      const nodes = doc.querySelectorAll(componentName);
      nodes.forEach((node, index) => {
        const uniqueId = `${componentName}-${index}`;
        if (getBeforeMount(componentName)) getBeforeMount(componentName)();
        if (getHead(componentName)) renderHead(getHead(componentName));
        if (getStyle(componentName)) renderStyles(getStyle(componentName));
        if (getAfterMount(componentName)) componetsMounted.push(getAfterMount(componentName));
        const attributes = {};
        Array.from(node.attributes).forEach((attr) => {
          attributes[attr.name] = attr.value;
        });
        let component = interpolateTemplate(getTemplate(componentName), { ...attributes, ...getState(componentName) });
        const subComponentDoc = parser.parseFromString(component, "text/html");
        if (subComponentDoc.querySelector(Object.keys(components).join(","))) {
          hasNestedComponents = true;
        }
        subComponentDoc.body.firstElementChild.setAttribute("data-component-id", uniqueId);
        node.outerHTML = subComponentDoc.body.innerHTML;
      });
    });
    doc = parser.parseFromString(doc.body.innerHTML, "text/html");
  }
  return { processedTemplate: doc.body.innerHTML, componetsMounted };
};
const render = (componentName, targerElement = document.body) => {
  try {
    const { template, head, style, state, beforeMount, afterMount } = getComponent(componentName);
    if (head) renderHead(head);
    if (style) renderStyles(style);
    if (beforeMount) beforeMount();
    if (template) {
      const { processedTemplate, componetsMounted } = processSubcomponents(template);
      targerElement.innerHTML = state ? interpolateTemplate(processedTemplate, state) : processedTemplate;
      if (afterMount) componetsMounted.push(afterMount);
      if (componetsMounted.length > 0) renderScripts(componetsMounted);
    } else {
      throw new Error(`Component '${componentName}' does not have a valid template.`);
    }
  } catch (error) {
    console.error(`Error during rendering: ${error.message}`);
  }
};
const updateNodesRecursively = (currentNode, newNode) => {
  if (!currentNode || !newNode) return;
  if (currentNode.nodeType === Node.TEXT_NODE && currentNode.textContent !== newNode.textContent) {
    currentNode.textContent = newNode.textContent;
  } else if (currentNode.nodeType === Node.ELEMENT_NODE && currentNode.tagName !== newNode.tagName) {
    currentNode.replaceWith(newNode.cloneNode(true));
  } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
    Array.from(newNode.attributes).forEach((attr) => {
      if (currentNode.getAttribute(attr.name) !== attr.value) {
        currentNode.setAttribute(attr.name, attr.value);
      }
    });
    const currentChildren = Array.from(currentNode.childNodes);
    const newChildren = Array.from(newNode.childNodes);
    const maxLen = Math.max(currentChildren.length, newChildren.length);
    for (let i = 0; i < maxLen; i++) {
      if (newChildren[i] && !currentChildren[i]) {
        currentNode.appendChild(newChildren[i].cloneNode(true));
      } else if (currentChildren[i] && !newChildren[i]) {
        currentNode.removeChild(currentChildren[i]);
      } else {
        updateNodesRecursively(currentChildren[i], newChildren[i]);
      }
    }
  }
};
const updateComponent = (name, targetElement = document.querySelector(`[data-component-id^="${name}"]`)) => {
  const template = getTemplate(name);
  const state = getState(name);
  if (template && state) {
    const { processedTemplate } = processSubcomponents(template);
    const renderedTemplate = interpolateTemplate(processedTemplate, state);
    const parser = new DOMParser();
    const doc = parser.parseFromString(renderedTemplate, "text/html");
    doc.body.firstElementChild.setAttribute("data-component-id", targetElement.getAttribute("data-component-id"));
    updateNodesRecursively(targetElement, doc.body.firstElementChild);
  }
};
const templateStore = {};
const headStore = {};
const styleStore = {};
const stateStore = {};
const beforeMountStore = {};
const afterMountStore = {};
const setTemplate = (name, template) => templateStore[name] = template;
const getTemplate = (name) => templateStore[name];
const getAllTemplates = () => ({ ...templateStore });
const setHead = (name, head) => headStore[name] = head;
const getHead = (name) => headStore[name];
const setStyle = (name, style) => styleStore[name] = style;
const getStyle = (name) => styleStore[name];
const setState = (name, initialState) => stateStore[name] = { ...initialState };
const updateState = (name, newState) => {
  if (stateStore[name]) {
    Object.assign(stateStore[name], newState);
    updateComponent(name);
  } else {
    console.error(`State for component "${name}" not found.`);
  }
};
const getState = (name) => stateStore[name];
const setBeforeMount = (name, callback) => beforeMountStore[name] = callback;
const getBeforeMount = (name) => beforeMountStore[name];
const setAfterMount = (name, callback) => afterMountStore[name] = callback;
const getAfterMount = (name) => afterMountStore[name];
const getComponent = (name) => {
  const template = getTemplate(name);
  const head = getHead(name);
  const style = getStyle(name);
  const state = getState(name);
  const beforeMount = getBeforeMount(name);
  const afterMount = getAfterMount(name);
  return { template, head, style, state, beforeMount, afterMount };
};
const headProcessor = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  let templateWithoutHead = tempDiv.innerHTML;
  let headContent = null;
  const customHead = tempDiv.querySelector("wiview\\:head");
  if (customHead) {
    headContent = customHead.innerHTML;
    customHead.remove();
    templateWithoutHead = tempDiv.innerHTML;
  }
  return { templateWithoutHead, headContent };
};
const styleProcessor = (component) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = component;
  let styleContent = null;
  const firstElement = tempDiv.firstElementChild;
  const styles = tempDiv.querySelector("style");
  if (!styles) return { templateWithoutStyle: component, styleContent };
  if (firstElement && styles.hasAttribute("scoped")) {
    const tagName = firstElement.tagName.toLowerCase();
    const id = firstElement.id ? `#${firstElement.id}` : "";
    let style = styles.innerHTML;
    const tagRegex = new RegExp(`(^|\\s|,)${tagName}(\\s|\\{|\\[|,|:|>|~|\\+)`, "g");
    const idRegex = new RegExp(`(^|\\s|,)${id}(\\s|\\{|\\[|,|:|>|~|\\+)`, "g");
    style = style.replace(tagRegex, (match, p1, p2) => `${p1}:scope${p2}`);
    if (id) style = style.replace(idRegex, (match, p1, p2) => `${p1}&${id}${p2}`);
    if (firstElement.classList.length > 0) {
      for (const className of firstElement.classList) {
        const classRegex = new RegExp(`(^|\\s|,).${className}(\\s|\\{|\\[|,|:|>|~|\\+)`, "g");
        style = style.replace(classRegex, (match, p1, p2) => `${p1}&.${className}${p2}`);
      }
    }
    styles.innerHTML = `@scope { ${style} }`;
    firstElement.appendChild(styles);
    styles.removeAttribute("scoped");
  } else {
    styleContent = styles.innerHTML;
    styles.remove();
  }
  return { templateWithoutStyle: tempDiv.innerHTML, styleContent };
};
const scriptProcessor = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  let templateWithoutScript = tempDiv.innerHTML;
  let scriptContent = null;
  const script = tempDiv.querySelector("script");
  if (script) {
    scriptContent = script.textContent;
    script.remove();
    templateWithoutScript = tempDiv.innerHTML;
  }
  return { templateWithoutScript, scriptContent };
};
const templateProcessor = (template) => {
  const { templateWithoutHead, headContent } = headProcessor(template);
  const { templateWithoutScript, scriptContent } = scriptProcessor(templateWithoutHead);
  const { templateWithoutStyle, styleContent } = styleProcessor(templateWithoutScript);
  const templateContent = templateWithoutStyle;
  return { templateContent, headContent, scriptContent, styleContent };
};
const registerComponent = (nameOrComponents, component = null) => {
  try {
    if (typeof nameOrComponents === "string" && component) {
      const { templateContent, headContent, scriptContent, styleContent } = templateProcessor(component.template);
      registerSingleComponent({
        name: nameOrComponents,
        template: templateContent,
        headContent,
        state: component.state,
        styleContent,
        beforeMount: component.beforeMount,
        scriptContent
      });
    } else if (typeof nameOrComponents === "object" && component === null) {
      for (const [name, componentDef] of Object.entries(nameOrComponents)) {
        if (!componentDef.template) {
          throw new Error(`Component '${name}' is missing a template.`);
        }
        const { templateContent, headContent, scriptContent, styleContent } = templateProcessor(componentDef.template);
        registerSingleComponent({
          name,
          template: templateContent,
          headContent,
          state: componentDef.state,
          styleContent,
          beforeMount: componentDef.beforeMount,
          scriptContent
        });
      }
    } else {
      throw new Error("Invalid format: You must pass a valid component name and component, or a component object.");
    }
  } catch (error) {
    console.error(error.message);
  }
};
function registerSingleComponent(component) {
  if (!component.template) {
    throw new Error(`Invalid component format: The component '${component.name}' must have a valid template.`);
  }
  setTemplate(component.name, component.template);
  if (component.headContent) setHead(component.name, component.headContent);
  if (component.state) setState(component.name, component.state);
  if (component.styleContent) setStyle(component.name, component.styleContent);
  if (component.beforeMount) setBeforeMount(component.name, component.beforeMount);
  if (component.scriptContent) setAfterMount(component.name, component.scriptContent);
}
const Router = (routes) => {
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
export {
  Router,
  getState,
  registerComponent,
  render,
  updateState
};
