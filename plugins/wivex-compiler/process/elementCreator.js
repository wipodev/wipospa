import * as cheerio from "cheerio";
import { processElement } from "./elementProcessor.js";
import { resolvedAnidedKey, resolvedReactiveAttr } from "../helpers/reactiveUtils.js";

export function createElement({
  tagName,
  index,
  attributes,
  container,
  innerHTML,
  resolveReactiveKey,
  getName,
  assingOn,
}) {
  let elementCode = `const ${tagName}${index} = document.createElement("${tagName}");\n`;
  elementCode += processInnerHTML(tagName, index, innerHTML, resolveReactiveKey, getName);
  elementCode += assingOn ? assingOn : "";
  elementCode += setAttributes(attributes, tagName, index, resolveReactiveKey);
  elementCode += `${container}.appendChild(${tagName}${index});\n`;
  return elementCode;
}

function processInnerHTML(tagName, index, innerHTML, resolveReactiveKey, getName) {
  let innerHTMLCode = "";

  if (innerHTML.includes("<")) {
    const $ = cheerio.load(innerHTML);
    const children = $("body").contents();

    children.each((i, el) => {
      if (el.type === "text") {
        const textContent = $(el).text().trim();
        if (textContent) {
          innerHTMLCode += processTextContent(tagName, index, textContent, resolveReactiveKey);
        }
      } else if (el.type === "tag") {
        innerHTMLCode += processElement($, el, `${i}${index}`, `${tagName}${index}`, resolveReactiveKey, getName);
      }
    });
  } else {
    innerHTMLCode += processTextContent(tagName, index, innerHTML, resolveReactiveKey);
  }

  return innerHTMLCode;
}

function processTextContent(tagName, index, innerHTML, resolveReactiveKey) {
  if (!innerHTML) return "";
  if (innerHTML.includes("{")) {
    const reactiveContent = innerHTML.replace(/{(.*?)}/g, (_, content) =>
      resolvedAnidedKey(content, resolveReactiveKey)
    );
    if (/^\s*{.*}\s*$/.test(innerHTML)) {
      return `${tagName}${index}.textContent = ${reactiveContent};\n`;
    } else {
      return `${tagName}${index}.textContent = \`${innerHTML.replace(
        /{(.*?)}/g,
        (_, content) => `\${${resolvedAnidedKey(content, resolveReactiveKey)}}`
      )}\`;\n`;
    }
  } else {
    return `${tagName}${index}.textContent = \`${innerHTML}\`;\n`;
  }
}

function setAttributes(attributes, tagName, index, resolveReactiveKey) {
  let setAttributeCode = "";
  Object.entries(attributes).forEach(([attr, value]) => {
    if (!attr.startsWith("on") && attr !== "data-for" && attr !== "data-if") {
      let newValue = `"${value}"`;
      if (value.includes("{")) {
        newValue = resolvedReactiveAttr(value, resolveReactiveKey);
      }
      setAttributeCode += `${tagName}${index}.setAttribute("${attr}", ${newValue});\n`;
    }
  });

  return setAttributeCode;
}
