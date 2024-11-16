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
import { renderHead } from "./renderHead.js";
import { renderStyles } from "./renderStyles.js";
import { renderScripts } from "./renderScripts.js";
import { interpolateTemplate } from "./interpolateProps.js";

export const processSubcomponents = (htmlString) => {
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
