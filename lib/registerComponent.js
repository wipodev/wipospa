import { addComponent, addState, addBeforeMount, addAfterMount } from "./componentRegistry.js";
import { processTemplate } from "./templateProcessor.js";
import { render } from "./renderEngine.js";

export const registerComponent = (nameOrComponents, component = null) => {
  if (typeof nameOrComponents === "string" && component) {
    const { processedTemplate, scriptContent } = processTemplate(component.template);
    addComponent(nameOrComponents, processedTemplate);
    if (component.state) addState(nameOrComponents, component.state);
    if (component.beforeMount) addBeforeMount(nameOrComponents, component.beforeMount);
    //if (component.afterMount) addAfterMount(nameOrComponents, component.afterMount);
    if (scriptContent) addAfterMount(nameOrComponents, scriptContent);
  } else if (typeof nameOrComponents === "object" && component === null) {
    for (const [name, componentDef] of Object.entries(nameOrComponents)) {
      const { processedTemplate, scriptContent } = processTemplate(componentDef.template);
      addComponent(name, processedTemplate);
      if (componentDef.state) addState(name, componentDef.state);
      if (componentDef.beforeMount) addBeforeMount(name, componentDef.beforeMount);
      //if (componentDef.afterMount) addAfterMount(name, componentDef.afterMount);
      if (scriptContent) addAfterMount(name, scriptContent);
    }
  } else {
    console.error("Invalid format: You must pass a name and component, or a component object.");
  }

  return { render };
};
