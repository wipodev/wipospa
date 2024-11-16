import { getAllComponents, getComponent, getState, getBefroreMount, getAfterMount } from "./componentRegistry.js";
import { processTemplate } from "./templateProcessor.js";
import { interpolateTemplate } from "./templateHandler.js";

const processSubcomponents = (htmlString) => {
  const parser = new DOMParser();
  let doc = parser.parseFromString(htmlString, "text/html");

  let hasNestedComponents = true;
  const componetsMounted = [];

  while (hasNestedComponents) {
    hasNestedComponents = false;

    const components = getAllComponents();
    Object.keys(components).forEach((componentName) => {
      const nodes = doc.querySelectorAll(componentName);
      nodes.forEach((node, index) => {
        const uniqueId = `${componentName}-${index}`;

        if (getBefroreMount(componentName)) getBefroreMount(componentName)();
        if (getAfterMount(componentName)) componetsMounted.push(getAfterMount(componentName));

        const attributes = {};
        Array.from(node.attributes).forEach((attr) => {
          attributes[attr.name] = attr.value;
        });

        let component = interpolateTemplate(getComponent(componentName), { ...attributes, ...getState(componentName) });

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

export const render = (template, targetElement = document.body) => {
  const { processedTemplate, componetsMounted } = processSubcomponents(processTemplate(template).processedTemplate);
  targetElement.innerHTML = processedTemplate;
  renderScripts(componetsMounted);
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

export const renderComponent = (name, targetElement = document.querySelector(`[data-component-id^="${name}"]`)) => {
  const template = getComponent(name);
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