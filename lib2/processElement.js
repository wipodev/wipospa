import * as cheerio from "cheerio";

export function elementProcessor($, el, i, container, resolveReactiveKey, getName) {
  const tagName = el.name;
  const isElement = el.type === "tag";

  if (!isElement) return "";
  const attributes = el.attribs;
  const innerHTML = $(el).html();
  const elementCode = processAttributes(tagName, i, attributes, container, innerHTML, resolveReactiveKey, getName);

  return elementCode;
}

function resolvedAnidedKey(content, resolveReactiveKey) {
  const [firstWord, ...rest] = content.trim().split(".");
  const resolvedKey = resolveReactiveKey(firstWord);
  return [resolvedKey, ...rest].join(".");
}

function resolvedReactiveAttr(content, resolveReactiveKey) {
  const resolvedContent = content.replace(/{(.*?)}/g, (_, attr) => resolvedAnidedKey(attr, resolveReactiveKey));
  if (/^\s*{.*}\s*$/.test(content)) {
    return resolvedContent;
  } else {
    return `\`${content.replace(/{(.*?)}/g, (_, attr) => `\${${resolvedAnidedKey(attr, resolveReactiveKey)}}`)}\``;
  }
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
    return `${tagName}${index}.textContent = "${innerHTML}";\n`;
  }
}

function processInnerHTML(tagName, index, innerHTML, resolveReactiveKey, getName) {
  let innerHTMLCode = "";
  if (innerHTML.includes("<")) {
    const $ = cheerio.load(innerHTML);
    const rootChild = $("body").children();
    const textContent = $("body")
      .contents()
      .filter((_, el) => el.type === "text")
      .text();
    innerHTMLCode += textContent.trim() ? processTextContent(tagName, index, textContent, resolveReactiveKey) : "";
    innerHTMLCode += rootChild
      .map((i, el) => elementProcessor($, el, i, `${tagName}${index}`, resolveReactiveKey, getName))
      .get()
      .join("\n");
  } else {
    innerHTMLCode += processTextContent(tagName, index, innerHTML, resolveReactiveKey);
  }

  return innerHTMLCode;
}

function processAttributes(tagName, index, attributes, container, innerHTML, resolveReactiveKey, getName) {
  if (Object.keys(attributes).length === 0) {
    return processElement(tagName, index, container, innerHTML, resolveReactiveKey, getName);
  }
  let attributeCode = "";
  Object.keys(attributes).forEach((attr) => {
    const value = attributes[attr].trim();
    if (attr === "data-if") {
      attributeCode += processDirectiveIf(
        value,
        container,
        tagName,
        index,
        innerHTML,
        resolveReactiveKey,
        attributes,
        getName
      );
    } else if (attr === "data-for") {
      attributeCode += processDirectiveFor(
        attributes,
        tagName,
        index,
        value,
        container,
        innerHTML,
        resolveReactiveKey,
        getName
      );
    } else if (attr.startsWith("on")) {
      attributeCode += processDirectiveOn(
        attr,
        value,
        container,
        tagName,
        index,
        innerHTML,
        resolveReactiveKey,
        getName,
        attributes
      );
    } else if (
      !attributes["data-if"] &&
      !attributes["data-for"] &&
      !attributeCode &&
      !Object.keys(attributes).some((key) => key.startsWith("on"))
    ) {
      attributeCode += `const ${tagName}${index} = document.createElement("${tagName}");\n`;
      attributeCode += processInnerHTML(tagName, index, innerHTML, resolveReactiveKey, getName);
      attributeCode += processSetAttributes(attributes, tagName, index, resolveReactiveKey);
      attributeCode += `${container}.appendChild(${tagName}${index});\n`;
    }
  });

  return attributeCode;
}

function processElement(tagName, index, container, innerHTML, resolveReactiveKey, getName) {
  let elementCode = `const ${tagName}${index} = document.createElement("${tagName}");\n`;
  elementCode += processInnerHTML(tagName, index, innerHTML, resolveReactiveKey, getName);
  elementCode += `${container}.appendChild(${tagName}${index});\n`;
  return elementCode;
}

function processSetAttributes(attributes, tagName, index, resolveReactiveKey) {
  let setAttributeCode = "";
  Object.keys(attributes).forEach((attr) => {
    if (!attr.startsWith("on") && attr !== "data-for" && attr !== "data-if") {
      let value = `"${attributes[attr]}"`;
      if (attributes[attr].includes("{")) {
        value = resolvedReactiveAttr(attributes[attr], resolveReactiveKey);
      }
      setAttributeCode += `${tagName}${index}.setAttribute("${attr}", ${value});\n`;
    }
  });

  return setAttributeCode;
}

function processDirectiveIf(value, container, tagName, index, innerHTML, resolveReactiveKey, attributes, getName) {
  const resolvedValue = value.replace(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g, (match) => resolveReactiveKey(match));
  let ifCode = `if (${resolvedValue}) {\n`;
  ifCode += `const ${tagName}${index} = document.createElement("${tagName}");\n`;
  ifCode += processInnerHTML(tagName, index, innerHTML, resolveReactiveKey, getName);
  ifCode += processSetAttributes(attributes, tagName, index, resolveReactiveKey);
  ifCode += `${container}.appendChild(${tagName}${index});\n}\n`;
  return ifCode;
}

function processDirectiveOn(
  attr,
  value,
  container,
  tagName,
  index,
  innerHTML,
  resolveReactiveKey,
  getName,
  attributes
) {
  let onCode = `const ${tagName}${index} = document.createElement("${tagName}");\n`;
  onCode += processInnerHTML(tagName, index, innerHTML, resolveReactiveKey, getName);
  onCode += `${tagName}${index}.${attr} = this.${value.replace(/\(\s*\)$/, "")};\n`;
  onCode += processSetAttributes(attributes, tagName, index, resolveReactiveKey);
  onCode += `${container}.appendChild(${tagName}${index});\n`;
  return onCode;
}

function processDirectiveFor(attr, tagName, index, value, container, innerHTML, resolveReactiveKey, getName) {
  const [item, array] = value.split(" in ").map((str) => str.trim());
  let forCode = `${resolveReactiveKey(array)}.forEach((${item}) => {\n`;
  const componentChild = getName(tagName);

  if (!componentChild) {
    forCode += processElement(tagName, index, container, innerHTML, resolveReactiveKey, getName);
  } else {
    forCode += processForComponentChild(attr, item, tagName, index, container, componentChild);
  }

  forCode += "});\n";
  return forCode;
}

function processForComponentChild(attr, item, tagName, index, container, componentChild) {
  const objAttr = Object.entries(attr || {})
    .map(([key, val]) => {
      if (key === "data-for") return null;
      const resolvedValue = val.replace(/{(.*?)}/g, (_, key) =>
        key.trim() === item ? item : resolveReactiveKey(key.trim())
      );
      return `${key}: ${resolvedValue}`;
    })
    .filter(Boolean)
    .join(", ");
  let childCode = `  const ${tagName}${index}Clone = new ${componentChild}({${objAttr}});\n`;
  childCode += `  ${tagName}${index}Clone.mount(${container});\n`;

  return childCode;
}
