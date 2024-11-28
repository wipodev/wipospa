import * as cheerio from "cheerio";
import { headProcessor } from "./processHead.js";
import { scriptProcessor } from "./processScripts.js";
import { styleProcessor } from "./processStyles.js";
import { elementProcessor } from "./processElement.js";

export default function componentProcessor(component, componentName) {
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
  return templateContent;
}

function preprocessComponent(component) {
  const { templateWithoutHead, headContent } = headProcessor(component);
  const { templateWithoutScript, scriptContent } = scriptProcessor(templateWithoutHead);
  const { templateWithoutStyle, styleContent } = styleProcessor(templateWithoutScript);
  const preProcessedTemplate = templateWithoutStyle;

  return {
    preProcessedTemplate,
    scriptContent,
    headContent,
    styleContent,
  };
}

function createReactiveResolver(stateKeys, propKeys) {
  return (key) => {
    if (stateKeys.includes(key)) return `this.state.${key}`;
    if (propKeys.includes(key)) return `this.props.${key}`;
    return key;
  };
}

function createGetName(imports) {
  return (word) => {
    const regex = new RegExp(`\\b${word}\\b`, "i");
    const match = imports.match(regex);
    return match ? match[0] : null;
  };
}
