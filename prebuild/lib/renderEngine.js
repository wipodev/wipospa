import {
  getComponent,
  getAllTemplates,
  getTemplate,
  getState,
  getBeforeMount,
  getAfterMount,
  getHead,
  getStyle,
} from "./componentDatabase.js";

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
      script();
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

export const render = (componentName, targerElement = document.body) => {
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

export const updateComponent = (name, targetElement = document.querySelector(`[data-component-id^="${name}"]`)) => {
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
