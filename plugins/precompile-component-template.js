import * as cheerio from "cheerio";

export const templateProcessor = (template) => {
  const { templateWithoutHead, headContent } = headProcessor(template);
  const { templateWithoutScript, scriptContent } = scriptProcessor(templateWithoutHead);
  const { templateWithoutStyle, styleContent } = styleProcessor(templateWithoutScript);
  const templateContent = templateWithoutStyle;
  return { templateContent, headContent, scriptContent, styleContent };
};

function headProcessor(html) {
  const $ = cheerio.load(html);
  const headContent = $("wiview\\:head").html();
  $("wiview\\:head").remove();
  const templateWithoutHead = $.html();
  return { templateWithoutHead, headContent };
}

function scriptProcessor(html) {
  const $ = cheerio.load(html);
  const importRegex = /import\s+.+?['"].+?['"]\s*;?/g;
  const stringCode = $("script").html();
  const scriptContent = stringCode ? `() => {${stringCode.replace(importRegex, "")}}`: "";
  $("script").remove();
  const templateWithoutScript = $.html();
  return { templateWithoutScript, scriptContent };
}

function styleProcessor(component) {
  const $ = cheerio.load(component);
  let styleContent = null;

  const firstElement = $("body").children().first();
  const styles = $("style");

  if (styles.length === 0) {
    return { templateWithoutStyle: component, styleContent };
  }

  if (firstElement.length > 0 && styles.attr("scoped") !== undefined) {
    const tagName = firstElement[0].tagName.toLowerCase();
    const id = firstElement.attr("id") ? `#${firstElement.attr("id")}` : "";

    let style = styles.html();

    const tagRegex = new RegExp(`(^|\\s|,)${tagName}(\\s|\\{|\\[|,|:|>|~|\\+)`, "g");
    const idRegex = id ? new RegExp(`(^|\\s|,)${id}(\\s|\\{|\\[|,|:|>|~|\\+)`, "g") : null;

    style = style.replace(tagRegex, (match, p1, p2) => `${p1}:scope${p2}`);
    if (idRegex) style = style.replace(idRegex, (match, p1, p2) => `${p1}&${id}${p2}`);

    const classList = firstElement.attr("class") ? firstElement.attr("class").split(" ") : [];
    if (classList.length > 0) {
      for (const className of classList) {
        const classRegex = new RegExp(`(^|\\s|,).${className}(\\s|\\{|\\[|,|:|>|~|\\+)`, "g");
        style = style.replace(classRegex, (match, p1, p2) => `${p1}&.${className}${p2}`);
      }
    }

    styles.html(`@scope { ${style} }`);
    firstElement.append(styles);
    styles.removeAttr("scoped");
  } else {
    styleContent = styles.html();
    styles.remove();
  }

  return { templateWithoutStyle: $("body").html(), styleContent };
}
