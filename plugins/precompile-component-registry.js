import fs from "fs";
import path, { relative } from "path";
import { registerComponent } from "./register-precompiled-components.js";
import { getStores } from "./precompiled-components-database.js";
import { copy } from "../commands/utils.js";

/**
 * Recursively searches a given directory for the defineComponents.js file.
 * @param {string} dir - The root directory where the search will start.
 * @returns {string|null} - The full path of the file if found, otherwise null.
 */
const findDefineComponentsFile = (dir) => {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory() && file !== "node_modules") {
      const result = findDefineComponentsFile(fullPath);
      if (result) return result;
    } else if (stats.isFile() && file === "defineComponents.js") {
      const content = fs.readFileSync(fullPath, "utf8");
      const modifiedContent = content.replace(/import/g, "const").replace(/from/g, "=");
      const tempFilePath = path.join(dir, "tempDefineComponents.js");
      fs.writeFileSync(tempFilePath, modifiedContent, "utf8");
      return tempFilePath;
    }
  }

  return null;
};

const loadHtmlFile = (filePath) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    console.error(`Error loading HTML file at ${filePath}:`, error);
    return null;
  }
};

const loadComponents = async (projectDir) => {
  try {
    const componentsFilePath = findDefineComponentsFile(projectDir);
    const dir = path.dirname(componentsFilePath);

    if (!componentsFilePath) {
      throw new Error("No se encontró el archivo defineComponents.js");
    }

    const defineContent = await import(`file://${path.join(process.cwd(), componentsFilePath)}`);

    for (const [key, value] of Object.entries(defineContent.components)) {
      if (value.template) {
        value.template = loadHtmlFile(path.join(dir, value.template));
      }
    }

    registerComponent(defineContent.components);

    fs.unlinkSync(componentsFilePath);
    console.log("Archivo temporal eliminado correctamente");
  } catch (error) {
    console.error("Error al eliminar el archivo temporal:", error);
  }
};

export const precompileComponentRegistry = async (projectDir) => {
  await loadComponents(projectDir);
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

  const preCompiledDir = (relativePath) => path.join(projectDir, "precompiled", relativePath);
  const rootDir = (relativePath) => path.join(projectDir, relativePath);
  const libDir = path.join(projectDir, "node_modules/wiview/plugins/lib");

  copy(libDir, preCompiledDir("lib"));
  fs.writeFileSync(preCompiledDir("lib/componentDatabase.js"), outputContent, "utf8");
  copy(rootDir("index.html"), preCompiledDir("index.html"));
  copy(rootDir("public"), preCompiledDir("public"));
  copy(rootDir("src/routes"), preCompiledDir("src/routes"));
  copy(rootDir("src/assets"), preCompiledDir("src/assets"));
  appProcessed(rootDir("src/app.js"));

  function appProcessed(appDir) {
    const appContent = fs.readFileSync(appDir, "utf8");
    let modifiedContent = appContent
      .replace(/^(import\s*{[^}]*?)\bregisterComponent,?\s*/gm, "$1")
      .replace(/["']wiview["']/g, '"../lib/index.js"');

    const registerRegex = /^\s*registerComponent\(([^)]+)\);\s*/gm;
    const importRegex = (variable) => new RegExp(`^\\s*import\\s+.*\\b${variable}\\b.*;\\s*`, "gm");

    let match;

    while ((match = registerRegex.exec(modifiedContent)) !== null) {
      const variable = match[1].trim();
      modifiedContent = modifiedContent.replace(importRegex(variable), "").replace(registerRegex, "");
    }

    fs.writeFileSync(preCompiledDir("src/app.js"), modifiedContent, "utf8");
  }
};
