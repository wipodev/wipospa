import { getTemplate, getState } from "./componentDatabase.js";
import { processSubcomponents } from "./renderEngine.js";
import { interpolateTemplate } from "./interpolateProps.js";

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
