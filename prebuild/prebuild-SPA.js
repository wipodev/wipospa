import fs from "fs";
import path from "path";
import { processDefineComponentsFile } from "./prebuild-defineComponentsProcessor.js";
import { registerComponent, getStores } from "./prebuild-componentRegistry.js";
import { findFile, copy } from "./utils.js";

/**
 * Prepares the project for building by processing components and copying necessary files.
 *
 * @param {string} rootDir - The root directory of the project.
 * @param {string} prebuildDir - The directory where prebuilt files will be copied to.
 *
 * This function performs the following tasks:
 * - Processes the defineComponents.js file and registers the components.
 * - Copies essential files and directories (like 'index.html', 'public', 'src/assets') from the root
 *   directory to the prebuild directory.
 * - Locates and copies the defineRoutes.js file to the prebuild directory.
 * - Processes the entry file (e.g., app.js or index.js), modifies its content, and writes it to the
 *   prebuild directory.
 * - Creates a component database script and writes it to the prebuild directory.
 */
export async function prebuildSpa(rootDir, prebuildDir) {
  const components = await processDefineComponentsFile(rootDir);
  registerComponent(components);

  const copySources = (source) => copy(path.join(rootDir, source), path.join(prebuildDir, source));
  const libDir = path.join(rootDir, "node_modules/wivex/prebuild/lib");
  const copyLib = (source, destination = null) =>
    copy(path.join(libDir, source), path.join(prebuildDir, "lib", destination || source));

  copyLib("renderEngine.js");
  copyLib("router.js");
  copyLib("indexSPA.js", "index.js");
  copySources("index.html");
  copySources("public");
  copySources("src/assets");

  const routesPath = findFile([`${rootDir}src`, `${rootDir}src/config`], ["defineRoutes.js"]);
  const routesBuildPath = path.join(prebuildDir, routesPath);
  copy(routesPath, routesBuildPath);

  const { entryFileContent, entryPath } = processEntryFile(rootDir);
  const entrybuildPath = path.join(prebuildDir, entryPath);
  fs.writeFileSync(entrybuildPath, entryFileContent, "utf8");

  const componentDatabaseContent = createComponentDatabase();
  const componentDatabasePath = path.join(prebuildDir, "lib/componentDatabase.js");
  fs.writeFileSync(componentDatabasePath, componentDatabaseContent, "utf8");
}

/**
 * Processes the project's main input file (app.js, index.js, main.js) by modifying
 * the import statements and removing calls to registerComponent.
 * @param {string} rootDir - The root directory of the project.
 * @returns {Object} An object containing the modified content and the original path of the entry file.
 */
function processEntryFile(rootDir) {
  try {
    const importRegex = (variable) => new RegExp(`^\\s*import\\s+.*\\b${variable}\\b.*;\\s*`, "gm");
    const entryPath = findFile([rootDir, `${rootDir}src`], ["app.js", "index.js", "main.js"]);
    const registerRegex = /^\s*registerComponent\(([^)]+)\);\s*/gm;
    const appContent = fs.readFileSync(entryPath, "utf8");

    let entryFileContent = appContent
      .replace(/^(import\s*{[^}]*?)\bregisterComponent,?\s*/gm, "$1")
      .replace(/["']wivex["']/g, '"../lib/index.js"');
    let match;

    while ((match = registerRegex.exec(entryFileContent)) !== null) {
      const variable = match[1].trim();
      entryFileContent = entryFileContent.replace(importRegex(variable), "").replace(registerRegex, "");
    }

    return { entryFileContent, entryPath };
  } catch (error) {
    console.error("Error processing entry file:", error);
  }
}

function createComponentDatabase() {
  const { templateStore, headStore, styleStore, stateStore, beforeMountStore, afterMountStore } = getStores();

  const code = Object.entries(afterMountStore)
    .map(([key, value]) => `${key}: ${value.trim()}`)
    .join(",\n");

  const outputContent = `
  import { updateComponent } from "./renderEngine.js";

  const templateStore = ${JSON.stringify(templateStore, null, 2)};
  const headStore = ${JSON.stringify(headStore, null, 2)};
  const styleStore = ${JSON.stringify(styleStore, null, 2)};
  const stateStore = ${JSON.stringify(stateStore, null, 2)};
  const beforeMountStore = ${JSON.stringify(beforeMountStore, null, 2)};
  const afterMountStore = {${code}};

  export const getTemplate = (name) => templateStore[name];

  export const getAllTemplates = () => ({ ...templateStore });

  export const getHead = (name) => headStore[name];

  export const getStyle = (name) => styleStore[name];

  export const updateState = (name, newState) => {
    if (stateStore[name]) {
      Object.assign(stateStore[name], newState);
      updateComponent(name);
    } else {
      console.error(\`State for component "\${name}" not found.\`);
    }
  };

  export const getState = (name) => stateStore[name];

  export const getBeforeMount = (name) => beforeMountStore[name];

  export const getAfterMount = (name) => afterMountStore[name];

  export const getComponent = (name) => {
    const template = getTemplate(name);
    const head = getHead(name);
    const style = getStyle(name);
    const state = getState(name);
    const beforeMount = getBeforeMount(name);
    const afterMount = getAfterMount(name);
    return { template, head, style, state, beforeMount, afterMount };
  };
  `;

  return outputContent;
}
