import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";
import { registerComponent, getComponent, getStores } from "./prebuild-componentRegistry.js";
import { processDefineComponentsFile } from "./prebuild-defineComponentsProcessor.js";
import { findFile, copy, ensureDirectoryExists } from "./utils.js";

export async function prebuildStatic(rootDir, prebuildDir, baseUrl) {
  try {
    const inputPaths = {};
    const components = await processDefineComponentsFile(rootDir);
    registerComponent(components);

    const copySources = (source) => copy(path.join(rootDir, source), path.join(prebuildDir, source));
    const libDir = path.join(rootDir, "node_modules/wivex/prebuild/lib");
    const copyLib = (source, destination = null) =>
      copy(path.join(libDir, source), path.join(prebuildDir, "lib", destination || source));

    copyLib("reactivityEngine.js");
    copyLib("indexStatic.js", "index.js");
    copySources("public");
    copySources("src/assets");

    const routesPath = findFile([`${rootDir}src`, `${rootDir}src/config`], ["defineRoutes.js"]);
    const routes = (await import(`file://${path.join(process.cwd(), routesPath)}`)).routes;

    const layout = routes.layout ? createLayout(routes.layout, prebuildDir, rootDir) : createLayout(rootDir);

    Object.entries(routes).forEach(([key, value]) => {
      if (key !== "layout") {
        console.log("Creating page:", key);
        createPage(layout.html(), value.component, value.selector, path.join(prebuildDir, key), baseUrl);
        if (key === "/") {
          inputPaths["main"] = path.join(prebuildDir, "index.html");
        } else {
          inputPaths[key.slice(1).toLowerCase()] = path.join(prebuildDir, key, "index.html");
        }
      }
    });

    const componentDatabaseContent = createComponentDatabase(baseUrl);
    const componentDatabasePath = path.join(prebuildDir, "lib/componentDatabase.js");
    fs.writeFileSync(componentDatabasePath, componentDatabaseContent, "utf8");

    return inputPaths;
  } catch (error) {
    console.error("Error building Static web:", error);
  }
}

function createLayout(layoutName = null, dir = null, rootDir) {
  const htmlString = fs.readFileSync("index.html", "utf8");
  const $ = cheerio.load(htmlString);

  if (layoutName) {
    const { template, beforeMount, afterMount, head, style, state } = getComponent(layoutName);
    const { processedTemplate, componentsAfterMounted, componentsHead, componentsStyles, componentsBeforeMount } =
      processSubcomponents(template);

    if (beforeMount) componentsBeforeMount.push(beforeMount);
    if (afterMount) componentsAfterMounted.push(afterMount);
    if (head) componentsHead.push(head);
    if (style) componentsStyles.push(style);

    $("body").html(processedTemplate);

    if (componentsStyles.length > 0) {
      const stylePath = `/src/assets/css/${layoutName}.css`;
      $("head").append(`<link rel="stylesheet" href="${stylePath}">`);
      fs.writeFileSync(path.join(dir, stylePath), componentsStyles.join("\n"));
    }

    if (componentsAfterMounted.length > 0) {
      const entryPath = findFile([rootDir, `${rootDir}src`], ["app.js", "index.js", "main.js"]);
      const entryBuildPath = path.join(dir, entryPath);
      const entryContent = `import { getState, updateState } from "../lib/index.js"
    
      document.addEventListener("DOMContentLoaded", () => {
          ${componentsAfterMounted.map((func) => `(${func})();`).join("\n")}
        });
      `;
      fs.writeFileSync(entryBuildPath, entryContent);
    }

    if (componentsHead.length > 0) {
      updateHead(componentsHead, $);
    }
  }
  return $;
}

function createPage(layout, name, selector, dir, baseUrl) {
  const $layout = cheerio.load(layout);
  const { template, beforeMount, afterMount, head, style, state } = getComponent(name);
  const { processedTemplate, componentsAfterMounted, componentsHead, componentsStyles, componentsBeforeMount } =
    processSubcomponents(template);

  if (beforeMount) componentsBeforeMount.push(beforeMount);
  if (afterMount) componentsAfterMounted.push(afterMount);
  if (head) componentsHead.push(head);
  if (style) componentsStyles.push(style);

  const $target = selector ? $layout(selector) : $layout("body");
  $target.html(processedTemplate);

  if (componentsStyles.length > 0) {
    $layout("head").append(`<link rel="stylesheet" href="${name}.css">`);
    fs.writeFileSync(path.join(dir, `${name}.css`), componentsStyles.join("\n"));
  }

  if (componentsAfterMounted.length > 0) {
    const entryContent = `document.addEventListener("DOMContentLoaded", () => {${componentsAfterMounted.join("\n")}});`;
    $layout("body").append(`<script src="${name}.js"></script>`);
    fs.writeFileSync(path.join(dir, `${name}.js`), entryContent);
  }

  if (componentsHead.length > 0) {
    updateHead(componentsHead, $layout);
  }

  updateInternalLinks($layout, baseUrl);

  const html = $layout.html();

  ensureDirectoryExists(dir);
  fs.writeFileSync(path.join(dir, "index.html"), html);
}

function processSubcomponents(htmlString) {
  const $ = cheerio.load(htmlString);

  let hasNestedComponents = true;
  const componentsAfterMounted = [];
  const componentsHead = [];
  const componentsStyles = [];
  const componentsBeforeMount = [];
  const { templateStore, headStore, styleStore, stateStore, beforeMountStore, afterMountStore } = getStores();

  while (hasNestedComponents) {
    hasNestedComponents = false;

    const components = templateStore;
    Object.keys(components).forEach((componentName) => {
      const nodes = $(componentName.toLowerCase());

      nodes.each((index, node) => {
        const $node = $(node);
        const uniqueId = `${componentName}-${index}`;

        if (beforeMountStore[componentName]) componentsBeforeMount.push(beforeMountStore[componentName]);
        if (headStore[componentName]) componentsHead.push(headStore[componentName]);
        if (styleStore[componentName]) componentsStyles.push(styleStore[componentName]);
        if (afterMountStore[componentName]) componentsAfterMounted.push(afterMountStore[componentName]);

        const attributes = {};
        Array.from(node.attribs || {}).forEach(([key, value]) => {
          attributes[key] = value;
        });

        let component = interpolateTemplate(templateStore[componentName], {
          ...attributes,
          ...stateStore[componentName],
        });

        const subComponentDom = cheerio.load(component);
        const subComponentNodes = Object.keys(components).join(",").toLowerCase();

        if (subComponentDom(subComponentNodes).length > 0) {
          hasNestedComponents = true;
        }

        subComponentDom("body > *").first().attr("data-component-id", uniqueId);

        $node.replaceWith(subComponentDom("body").html());
      });
    });
  }

  return {
    processedTemplate: $.html("body"),
    componentsAfterMounted,
    componentsHead,
    componentsStyles,
    componentsBeforeMount,
  };
}

function interpolateTemplate(component, props) {
  for (const key in props) {
    if (props.hasOwnProperty(key)) {
      const propKey = new RegExp(`{${key}}`, "gi");
      component = component.replace(propKey, (match) => props[key]);
    }
  }
  return component;
}

function updateHead(head, $) {
  if (!head) return;
  const $tempDiv = cheerio.load(`<div>${head}</div>`)("div");

  $tempDiv.children().each((_, element) => {
    const $element = $(element);
    const tagName = $element.prop("tagName").toLowerCase();

    if (tagName === "title") {
      $("title").text($element.text());
    } else if (tagName === "meta") {
      updateMeta($, $element);
    } else {
      updateHeadElement($, $element);
    }
  });
}

function updateMeta($, $element) {
  const name = $element.attr("name");
  const content = $element.attr("content");

  const existingMeta = $(`meta[name="${name}"]`);
  if (existingMeta.length > 0) {
    existingMeta.attr("content", content);
  } else {
    $("head").append($element);
  }
}

function updateHeadElement($, $element) {
  const tagName = $element.prop("tagName").toLowerCase();
  const existingElement = $(`head ${tagName}`).first();

  if (existingElement.length > 0) {
    existingElement.replaceWith($element);
  } else {
    $("head").append($element);
  }
}

function createComponentDatabase(baseUrl) {
  const { templateStore, stateStore } = getStores();

  Object.entries(templateStore).forEach(([name, content]) => {
    const $ = cheerio.load(content);
    updateAllInternalLinks($, baseUrl);
    templateStore[name] = $.html();
  });

  const outputContent = `
  import { updateComponent } from "./reactivityEngine.js";

  const templateStore = ${JSON.stringify(templateStore, null, 2)};
  const stateStore = ${JSON.stringify(stateStore, null, 2)};

  export const getTemplate = (name) => templateStore[name];

  export const getAllTemplates = () => ({ ...templateStore });

  export const updateState = (name, newState) => {
    if (stateStore[name]) {
      Object.assign(stateStore[name], newState);
      updateComponent(name);
    } else {
      console.error(\`State for component "\${name}" not found.\`);
    }
  };

  export const getState = (name) => stateStore[name];
  `;

  return outputContent;
}

function updateInternalLinks($layout, base, tag = "a", attr = "href") {
  $layout(`${tag}[${attr}]`).each((_, element) => {
    const $element = $layout(element);
    const url = $element.attr(attr);

    if (url.startsWith("/")) {
      const newUrl = url === "/" ? base : `${base}${url.slice(1)}${tag === "a" ? "/" : ""}`;
      $element.attr(attr, newUrl);
    }
  });
}

function updateAllInternalLinks($layout, base) {
  const elementsWithUrls = [
    { tag: "a", attr: "href" },
    { tag: "img", attr: "src" },
    { tag: "video", attr: "src" },
    { tag: "video", attr: "poster" },
    { tag: "audio", attr: "src" },
    { tag: "source", attr: "src" },
    { tag: "form", attr: "action" },
  ];

  elementsWithUrls.forEach(({ tag, attr }) => {
    updateInternalLinks($layout, base, tag, attr);
  });
}
