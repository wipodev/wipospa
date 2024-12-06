import * as cheerio from "cheerio";

export function headProcessor(html) {
  const $ = cheerio.load(html);
  let headContent = "";
  const headTemplate = $("wivex\\:head")
    .children()
    .map((_, el) => {
      const tagName = el.tagName.toLowerCase();
      const attributes = el.attribs;

      if (tagName === "title") {
        return `document.title = "${$(el).html()}";`;
      } else if (tagName === "meta") {
        return `const existingMeta = document.querySelector("meta[name='${attributes.name}']");

  if (existingMeta) {
    existingMeta.setAttribute("content", "${attributes.content}");
  } else {
    const element = document.createElement("meta");
    element.setAttribute("name", "${attributes.name}");
    element.setAttribute("content", "${attributes.content}");
    document.head.appendChild(element);
  }`;
      } else {
        let setAttributes = "";
        Object.entries(attributes).forEach(([key, value]) => {
          setAttributes += `element.setAttribute("${key}", ${value});\n`;
        });
        return `const existingElement = document.head.querySelector("${tagName}");

  const element = document.createElement("${tagName}");
  element.innerHTML = ${$(el).html()};
  ${setAttributes}
  if (existingElement) {
    existingElement.replaceWith(element);
  } else {
    document.head.appendChild(element);
  }`;
      }
    })
    .get()
    .join("\n");

  if (headTemplate) {
    headContent += "renderHead() {\n";
    headContent += headTemplate;
    headContent += "\n}\n";
  }

  const fullTag = $("wivex\\:head").toString();
  const startIndex = html.indexOf("<wivex:head>");
  const endIndex = startIndex + fullTag.length;
  const indexes = { start: startIndex, end: endIndex };

  return { headContent, indexes };
}
