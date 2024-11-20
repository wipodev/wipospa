import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";
import * as cheerio from "cheerio";
import { registerComponent, getComponent, getStores } from "./prebuild-componentRegistry.js";
import { processDefineComponentsFile } from "./prebuild-defineComponentsProcessor.js";
import { findFile, copy } from "./utils.js";

export async function prebuildStatic(rootDir, prebuildDir) {
  try {
    const components = await processDefineComponentsFile(rootDir);
    registerComponent(components);

    const routesPath = findFile([`${rootDir}src`, `${rootDir}src/config`], ["defineRoutes.js"]);
    const routes = (await import(`file://${path.join(process.cwd(), routesPath)}`)).routes;

    const copySources = (source) => copy(path.join(rootDir, source), path.join(prebuildDir, source));

    copySources("public");
    copySources("src/assets");

    if (routes.layout) {
      const layout = createLayout(routes.layout);
      console.log(layout);
    }
  } catch (error) {
    console.error("Error building Static web:", error);
  }
}

function createLayout(layoutName) {
  const htmlString = fs.readFileSync("index.html", "utf8");
  const dom = new JSDOM(htmlString);
  const document = dom.window.document;

  const { template } = getComponent(layoutName);
  const layoutContent = processSubcomponents(template);

  document.body.innerHTML = layoutContent;
  return document;
}

function processSubcomponents(htmlString) {
  const dom = new JSDOM(htmlString);
  const document = dom.window.document;

  let hasNestedComponents = true;
  const componentsAfterMounted = [];
  const componentsHead = [];
  const componentsBeforeMount = [];
  const { templateStore, headStore, stateStore, beforeMountStore, afterMountStore } = getStores();

  while (hasNestedComponents) {
    hasNestedComponents = false;

    const components = templateStore;
    Object.keys(components).forEach((componentName) => {
      const nodes = document.querySelectorAll(componentName);

      nodes.forEach((node, index) => {
        const uniqueId = `${componentName}-${index}`;

        if (beforeMountStore[componentName]) componentsBeforeMount.push(beforeMountStore[componentName]);
        if (headStore[componentName]) componentsHead.push(headStore[componentName]);
        if (afterMountStore[componentName]) componentsAfterMounted.push(afterMountStore[componentName]);

        const attributes = {};
        Array.from(node.attributes).forEach((attr) => {
          attributes[attr.name] = attr.value;
        });

        let component = interpolateTemplate(templateStore[componentName], {
          ...attributes,
          ...stateStore[componentName],
        });

        const subComponentDom = new JSDOM(component);
        const subComponentDoc = subComponentDom.window.document;

        if (subComponentDoc.querySelector(Object.keys(components).join(","))) {
          hasNestedComponents = true;
        }

        subComponentDoc.body.firstElementChild.setAttribute("data-component-id", uniqueId);

        node.outerHTML = subComponentDoc.body.innerHTML;
      });
    });

    const updatedHTML = document.body.innerHTML;
    const newDom = new JSDOM(updatedHTML);
    document.body.innerHTML = newDom.window.document.body.innerHTML;
  }

  return { processedTemplate: document.body.innerHTML, componentsAfterMounted, componentsHead, componentsBeforeMount };
}
