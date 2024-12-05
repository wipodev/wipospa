import * as cheerio from "cheerio";
import { preprocessComponent } from "../preprocess/preprocessComponent.js";
import { elementProcessor } from "./processElement.js";
import { createReactiveResolver, createGetName } from "../helpers/reactiveUtils.js";

export function componentProcessor(component, componentName) {
  const { preProcessedTemplate, scriptContent, headContent, styleContent } = preprocessComponent(component);
  const { imports, state, props } = scriptContent;
  const stateKeys = Object.keys(state);
  const propKeys = Object.keys(props);
  const $ = cheerio.load(preProcessedTemplate);

  if ($("body").children().length > 1) {
    throw new Error("Only one root element is allowed");
  }

  const rootElement = $("body").children().first();
  const container = rootElement[0].name;

  const resolveReactiveKey = createReactiveResolver(stateKeys, propKeys);
  const getName = createGetName(imports);

  let templateContent = `const ${container} = document.createElement("${container}");\n`;
  templateContent += `${container}.setAttribute("data-component-id", \`${componentName}-\${this.id}\`);\n\n`;

  templateContent += rootElement
    .children()
    .map((i, el) => elementProcessor($, el, i, container, resolveReactiveKey, getName))
    .get()
    .join("\n");
  return { templateContent, scriptContent, headContent, styleContent, container };
}