export const styleProcessor = (component) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = component;
  let styleContent = null;

  const firstElement = tempDiv.firstElementChild;
  const styles = tempDiv.querySelector("style");

  if (!styles) return { templateWithoutStyle: component, styleContent };

  if (firstElement && styles.hasAttribute("scoped")) {
    const tagName = firstElement.tagName.toLowerCase();
    const id = firstElement.id ? `#${firstElement.id}` : "";

    let style = styles.innerHTML;

    const tagRegex = new RegExp(`(^|\\s|,)${tagName}(\\s|\\{|\\[|,|:|>|~|\\+)`, "g");
    const idRegex = new RegExp(`(^|\\s|,)${id}(\\s|\\{|\\[|,|:|>|~|\\+)`, "g");

    style = style.replace(tagRegex, (match, p1, p2) => `${p1}:scope${p2}`);
    if (id) style = style.replace(idRegex, (match, p1, p2) => `${p1}&${id}${p2}`);

    if (firstElement.classList.length > 0) {
      for (const className of firstElement.classList) {
        const classRegex = new RegExp(`(^|\\s|,).${className}(\\s|\\{|\\[|,|:|>|~|\\+)`, "g");
        style = style.replace(classRegex, (match, p1, p2) => `${p1}&.${className}${p2}`);
      }
    }

    styles.innerHTML = `@scope { ${style} }`;
    firstElement.appendChild(styles);
    styles.removeAttribute("scoped");
  } else {
    styleContent = styles.innerHTML;
    styles.remove();
  }

  return { templateWithoutStyle: tempDiv.innerHTML, styleContent };
};
