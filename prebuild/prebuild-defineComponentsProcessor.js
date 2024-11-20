import fs from "fs";
import path from "path";
import { findFile } from "./utils.js";

/**
 * Processes the defineComponents.js file by replacing the import statements with const assignments.
 *
 * @async
 * @param {string} rootDir - The root directory of the project.
 * @returns {Promise<Object>} A promise that resolves to an object containing the components.
 *                            Each component may include its `template` content if specified.
 */
export async function processDefineComponentsFile(rootDir) {
  try {
    const originalPath = findFile([`${rootDir}src`, `${rootDir}src/config`], ["defineComponents.js"]);
    const originalDir = path.dirname(originalPath);
    const originalContent = fs.readFileSync(originalPath, "utf8");
    const contentModified = originalContent.replace(/import/g, "const").replace(/from/g, "=");
    const tempFilePath = path.join(originalDir, "temp_Define.js");
    fs.writeFileSync(tempFilePath, contentModified, "utf8");

    const defineContent = await import(`file://${path.join(process.cwd(), tempFilePath)}`);

    for (const [key, value] of Object.entries(defineContent.components)) {
      if (value.template) {
        value.template = fs.readFileSync(path.join(originalDir, value.template), "utf8");
      }
    }
    fs.unlinkSync(tempFilePath);
    return defineContent.components;
  } catch (error) {
    console.error("Error processing defineComponents.js:", error);
  }
}