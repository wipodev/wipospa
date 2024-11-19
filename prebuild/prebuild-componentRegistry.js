import { templateProcessor } from "./prebuild-processTemplate.js";

const templateStore = {};
const headStore = {};
const styleStore = {};
const stateStore = {};
const beforeMountStore = {};
const afterMountStore = {};

/**
 * Returns all stores for the prebuilt components.
 * @returns {Object} - An object with the following properties: templateStore, headStore, styleStore, stateStore, beforeMountStore, afterMountStore.
 */
export function getStores() {
  return { templateStore, headStore, styleStore, stateStore, beforeMountStore, afterMountStore };
}

/**
 * Registers a single component or multiple components.
 * If a string and a component definition are given, it will register a single component.
 * If an object is given, it will iterate over the object and register each component.
 * @param {String|Object} nameOrComponents - The name of the component or an object with components.
 * @param {Object} [component] - The component definition.
 */
export function registerComponent(nameOrComponents, component = null) {
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
}

function registerSingleComponent(component) {
  if (!component.template) {
    throw new Error(`Invalid component format: The component '${component.name}' must have a valid template.`);
  }

  templateStore[component.name] = component.template;
  if (component.headContent) headStore[component.name] = component.headContent;
  if (component.state) stateStore[component.name] = { ...component.state };
  if (component.styleContent) styleStore[component.name] = component.styleContent;
  if (component.beforeMount) beforeMountStore[component.name] = component.beforeMount;
  if (component.scriptContent) afterMountStore[component.name] = component.scriptContent;
}
