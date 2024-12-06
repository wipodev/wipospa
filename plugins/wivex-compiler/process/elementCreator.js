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
  assignOn,
}) {
  let elementCode = `const ${tagName}${index} = document.createElement("${tagName}");\n`;
  elementCode += processInnerHTML(tagName, index, innerHTML, resolveReactiveKey, getName);
  elementCode += assignOn ? assignOn : "";
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
        const textContent = $(el).text();
        if (textContent) {
          innerHTMLCode += processTextContent(tagName, index, textContent, resolveReactiveKey, i);
        }
      } else if (el.type === "tag") {
        innerHTMLCode += processElement($, el, `${i}${index}`, `${tagName}${index}`, resolveReactiveKey, getName);
      }
    });
  } else {
    innerHTMLCode += processTextContent(tagName, index, innerHTML, resolveReactiveKey, index);
  }

  return innerHTMLCode;
}

function processTextContent(tagName, index, innerHTML, resolveReactiveKey, subIndex) {
  if (!innerHTML) return "";

  const textNodeName = `${tagName}${index}TextNode${subIndex}`;
  if (innerHTML.includes("{")) {
    const reactiveContent = innerHTML.replace(/{(.*?)}/g, (_, content) =>
      resolvedAnidedKey(content, resolveReactiveKey)
    );
    if (/^\s*{.*}\s*$/.test(innerHTML)) {
      return (
        `const ${textNodeName} = document.createTextNode(${reactiveContent});\n` +
        `${tagName}${index}.appendChild(${textNodeName});\n`
      );
    } else {
      return (
        `const ${textNodeName} = document.createTextNode(\`${innerHTML.replace(
          /{(.*?)}/g,
          (_, content) => `\${${resolvedAnidedKey(content, resolveReactiveKey)}}`
        )}\`);\n` + `${tagName}${index}.appendChild(${textNodeName});\n`
      );
    }
  } else {
    return (
      `const ${textNodeName} = document.createTextNode(\`${innerHTML}\`);\n` +
      `${tagName}${index}.appendChild(${textNodeName});\n`
    );
  }
}

export function setAttributes(attributes, tagName, index, resolveReactiveKey) {
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
