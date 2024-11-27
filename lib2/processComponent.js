import * as cheerio from "cheerio";
import { headProcessor } from "./processHead.js";
import { scriptProcessor } from "./processScripts.js";
import { styleProcessor } from "./processStyles.js";

export default function componentProcessor(component, componentName) {
  const { templateWithoutHead, headContent } = headProcessor(component);
  const { templateWithoutScript, scriptContent } = scriptProcessor(templateWithoutHead);
  const { templateWithoutStyle, styleContent } = styleProcessor(templateWithoutScript);
  const { imports, state, props, methods } = scriptContent;

  const getName = (word) => {
    const regex = new RegExp(`\\b${word}\\b`, "i");
    const match = imports.match(regex);
    return match ? match[0] : null;
  };

  const $ = cheerio.load(templateWithoutStyle);
  let templateContent = "";
  const rootElement = $("body").children().first();
  const container = rootElement[0].name;

  const stateKeys = Object.keys(state);
  const propKeys = Object.keys(props);

  templateContent += `const ${container} = document.createElement("${container}");\n`;
  templateContent += `${container}.setAttribute("data-component-id", \`${componentName}-\${this.id}\`);\n\n`;

  const resolveReactiveKey = (key) => {
    if (stateKeys.includes(key)) return `this.state.${key}`;
    if (propKeys.includes(key)) return `this.props.${key}`;
    return key;
  };

  rootElement.find("*").each((i, el) => {
    const tagName = el.name;
    const isElement = el.type === "tag";

    if (isElement) {
      const attributes = el.attribs;
      let elementCode = `const ${tagName}${i} = document.createElement("${tagName}");\n`;

      const innerHTML = $(el).html();
      if (innerHTML && innerHTML.includes("{")) {
        const reactiveContent = innerHTML.replace(/{(.*?)}/g, (match, key) => resolveReactiveKey(key.trim()));
        if (/^\s*{.*}\s*$/.test(innerHTML)) {
          elementCode += `${tagName}${i}.textContent = ${reactiveContent};\n`;
        } else {
          elementCode += `${tagName}${i}.textContent = \`${innerHTML.replace(
            /{(.*?)}/g,
            (_, key) => `\${${resolveReactiveKey(key.trim())}}`
          )}\`;\n`;
        }
      } else if (innerHTML) {
        elementCode += `${tagName}${i}.textContent = "${innerHTML.trim()}";\n`;
      }

      Object.keys(attributes).forEach((attr) => {
        if (attr === "data-if") {
          elementCode += `if (${resolveReactiveKey(attributes[attr].trim())}) {\n`;
          elementCode += `  ${container}.appendChild(${tagName}${i});\n`;
          elementCode += `}\n\n`;
        } else if (attr === "data-for") {
          elementCode = "";
          const [item, array] = attributes[attr].split(" in ").map((str) => str.trim());
          elementCode += `${resolveReactiveKey(array)}.forEach((${item}) => {\n`;
          const componentChild = getName(tagName);
          if (!componentChild) {
            elementCode += `  const ${tagName}${i}Clone = document.createElement("${tagName}");\n`;

            if (innerHTML && innerHTML.includes("{")) {
              const reactiveLoopContent = innerHTML.replace(/{(.*?)}/g, (_, key) =>
                key.trim() === item ? item : resolveReactiveKey(key.trim())
              );
              if (reactiveLoopContent === item) {
                elementCode += `  ${tagName}${i}Clone.textContent = ${item};\n`;
              } else {
                elementCode += `  ${tagName}${i}Clone.textContent = \`${innerHTML.replace(
                  /{(.*?)}/g,
                  (_, key) => `\${${resolveReactiveKey(key.trim())}}`
                )}\`;\n`;
              }
            }
            elementCode += `${tagName}${i}.setAttribute("${attr}", "${attributes[attr]}");\n`;
            elementCode += `  ${container}.appendChild(${tagName}${i}Clone);\n`;
            elementCode += `});\n\n`;
          } else {
            const objAttr = Object.entries(attributes || {})
              .map(([key, value]) => {
                if (key === "data-for") return null;
                const resolvedValue = value.replace(/{(.*?)}/g, (_, key) =>
                  key.trim() === item ? item : resolveReactiveKey(key.trim())
                );
                return `${key}: ${resolvedValue}`;
              })
              .filter(Boolean)
              .join(", ");
            elementCode += `  const ${tagName}${i}Clone = new ${componentChild}({${objAttr}});\n`;
            elementCode += `  ${tagName}${i}Clone.mount(${container});\n`;
            elementCode += `});\n\n`;
          }
        } else if (attr.startsWith("on")) {
          elementCode += `${tagName}${i}.${attr} = this.${attributes[attr].replace(/\(\s*\)$/, "")};\n`;
        } else {
          elementCode += `${tagName}${i}.setAttribute("${attr}", "${attributes[attr]}");\n`;
        }
      });

      if (!attributes["data-if"] && !attributes["data-for"]) {
        templateContent += elementCode;
        templateContent += `${container}.appendChild(${tagName}${i});\n\n`;
      } else {
        templateContent += elementCode;
      }
    }
  });

  console.log(templateContent);
}
