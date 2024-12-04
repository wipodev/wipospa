import * as cheerio from "cheerio";

/**
 * Processes style tags and their contents from a template, and scopes their selectors
 * to the first element in the template, if the style tag has the "scoped" attribute.
 * If the style tag does not have the "scoped" attribute, it is removed from the
 * template and its contents are returned as a string.
 *
 * @param {string} component - The template to process
 * @returns {Object} An object containing the processed style content and the indexes
 * of the style tags in the original component string.
 */
export function styleProcessor(component) {
  const $ = cheerio.load(component);
  const firstElement = $("body").children().first();
  const fullStyle = $("style").toString();
  const rootStyles = $("style");
  let styles = "";

  if (rootStyles.length === 0) return styles;

  styles = rootStyles.html();
  const startIndex = component.indexOf(fullStyle);
  const endIndex = startIndex + fullStyle.length;
  const indexes = { start: startIndex, end: endIndex };

  if (firstElement.length > 0 && rootStyles.attr("scoped") !== undefined) {
    const tagName = firstElement[0].tagName.toLowerCase();
    const id = firstElement.attr("id") ? `#${firstElement.attr("id")}` : "";
    const classList = firstElement.attr("class") ? firstElement.attr("class").split(" ") : [];
    const tagRegex = new RegExp(`(^|\\s|,)${tagName}(\\s|\\{|\\[|,|:|>|~|\\+)`, "g");
    const idRegex = id ? new RegExp(`(^|\\s|,)${id}(\\s|\\{|\\[|,|:|>|~|\\+)`, "g") : null;

    styles = styles.replace(tagRegex, (_, p1, p2) => `${p1}:scope${p2}`);
    if (idRegex) styles = styles.replace(idRegex, (_, p1, p2) => `${p1}&${id}${p2}`);

    if (classList.length > 0) {
      for (const className of classList) {
        const classRegex = new RegExp(`(^|\\s|,).${className}(\\s|\\{|\\[|,|:|>|~|\\+)`, "g");
        styles = styles.replace(classRegex, (_, p1, p2) => `${p1}&.${className}${p2}`);
      }
    }

    styles = `@scope { ${styles} }`;
  }

  return { styles, indexes };
}
