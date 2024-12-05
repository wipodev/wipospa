import { processDirectives } from "./directivesProcessor.js";

export function processElement($, el, index, container, resolveReactiveKey, getName) {
  const tagName = el.name;
  const isElement = el.type === "tag";

  if (!isElement) return "";
  const attributes = el.attribs;
  const innerHTML = $(el).html();
  const elementCode = processDirectives({
    tagName,
    index,
    attributes,
    container,
    innerHTML,
    resolveReactiveKey,
    getName,
  });

  return elementCode;
}
