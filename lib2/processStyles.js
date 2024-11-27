import * as cheerio from "cheerio";

/**
 * Extracts style tags and their contents from a template, and scopes their selectors
 * to the first element in the template, if the style tag has the "scoped" attribute.
 * If the style tag does not have the "scoped" attribute, it is removed from the
 * template and its contents are returned as a string.
 *
 * @param {string} component - The template to process
 * @returns {Object} An object containing the processed template and the extracted
 * style content, if any.
 */
export function styleProcessor(component) {
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
