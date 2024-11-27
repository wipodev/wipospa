import * as cheerio from "cheerio";

const directives = {
  if: /<([\w-]+)\s+[^>]*data-if="([^"]+)">([\s\S]*?)<\/\1>/g,
  else: /<([\w-]+)\s+[^>]*data-else="([^"]+)">([\s\S]*?)<\/\1>/g,
  elseif: /<([\w-]+)\s+[^>]*data-else-if="([^"]+)">([\s\S]*?)<\/\1>/g,
  for: /<([\w-]+)\s+[^>]*data-for="(\w+)\s+in\s+(\w+)"([^>]*)>([\s\S]*?)<\/\1>/g,
  each: /<([\w-]+)\s+[^>]*data-each="(\w+)\s+in\s+(\w+)"([^>]*)>([\s\S]*?)<\/\1>/g,
  show: /<([\w-]+)\s+[^>]*data-show="([^"]+)">([\s\S]*?)<\/\1>/g,
  hide: /<([\w-]+)\s+[^>]*data-hide="([^"]+)">([\s\S]*?)<\/\1>/g,
  on: /on(\w+)="(\w+)\((.*?)\)"/g,
};

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

function headProcessor(html) {
  const $ = cheerio.load(html);
  const headContent = $("wivex\\:head").html();
  $("wivex\\:head").remove();
  const templateWithoutHead = $.html();
  return { templateWithoutHead, headContent };
}

function scriptProcessor(html) {
  const scriptContent = {
    imports: "",
    state: {},
    props: {},
    methods: {},
  };
  const importRegex = /import\s+[^;]+;?/g;
  const stateRegex = /let\s+(\w+)\s*(?:=\s*([^;]+))?\s*;?/g;
  const propsRegex = /var\s+(\w+)\s*(?:=\s*([^;]+))?\s*;?/g;
  const functionRegex = /function\s+(\w+)\s*\((.*?)\)\s*\{([\s\S]*?)\}/g;
  const functionRegex2 =
    /(?:function\s+(\w+)\s*\(.*?\)\s*\{[\s\S]*?\}|const\s+(\w+)\s*=\s*\(.*?\)\s*=>\s*\{[\s\S]*?\})/g;

  const $ = cheerio.load(html);
  const stringCode = $("script").html();
  $("script").remove();
  const templateWithoutScript = $.html();

  if (stringCode) {
    let match;
    while ((match = importRegex.exec(stringCode))) {
      scriptContent.imports += `${match}\n`;
    }
    while ((match = stateRegex.exec(stringCode))) {
      const [, stateName, stateValue] = match;
      scriptContent.state[stateName] = stateValue || "";
    }
    while ((match = propsRegex.exec(stringCode))) {
      const [, propName, propValue] = match;
      scriptContent.props[propName] = propValue || "";
    }
    while ((match = functionRegex2.exec(stringCode))) {
      //const [fullFunc, name] = match;
      const fullFunc = match[0];
      const name = match[1] || match[2];

      if (!name) continue;

      const updatedFunc = [
        ...Object.entries(scriptContent.state).map(([key]) => [key, "state"]),
        ...Object.entries(scriptContent.props).map(([key]) => [key, "props"]),
      ].reduce((func, [key, prefix]) => {
        const regex = new RegExp(`\\b${key}\\b`, "g");
        return func.replace(regex, `${prefix}.${key}`);
      }, fullFunc);

      scriptContent.methods[name] = updatedFunc;
    }
  }

  return { templateWithoutScript, scriptContent };
}

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

// datos de prueba
const html = /*html*/ `
<script>
  import Hijo from "/src/app/components/Hijo.html";
  var titulo;
  var boton;

  let count = 0;
  let names = ["pepe", "paco", "luis", "jose", "wladimir"];

  function increment() {
    count++;
    console.log(count)
  }
</script>

<section>
  <h1>{titulo}</h1>
  <button onclick="increment()">{boton}</button>
  <p data-if="count > 0">Contador: {count}</p>
  <Hijo data-for="name in names" title="{name}" num="2"></Hijo>
  <ul>
    <li data-for="name in names">{name}</li>
  </ul>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding-inline: var(--pico-spacing);

    section img {
      width: 30%;
      height: auto;
    }

    h1 {
      display: flex;
      gap: 0.5rem;
      align-items: baseline;

      span[data-title-lib] {
        font-size: inherit;
      }
    }

    p {
      text-align: center;
    }
  }
</style>
`;
// ejemplo de uso

componentProcessor(html, "Home");
