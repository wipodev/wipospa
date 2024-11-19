import {
  setTemplate,
  setHead,
  setStyle,
  setState,
  setBeforeMount,
  setAfterMount,
} from "./precompiled-components-database.js";
import { templateProcessor } from "./precompile-component-template.js";

export const registerComponent = (nameOrComponents, component = null) => {
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
        scriptContent,
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
          scriptContent,
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
  if (component.scriptContent) {
    setAfterMount(component.name, component.scriptContent);
  }
}
