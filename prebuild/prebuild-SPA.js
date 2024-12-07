import fs from "fs";
import path from "path";
import { compileComponent } from "../plugins/wivex-compiler/compiler.js";
import { findFile, copy, ensureDirectoryExists } from "./utils.js";

/**
 * Prebuilds the Single Page Application (SPA) by copying the entry point (index.html), public folder, and assets folder.
 * Also copies the defineRoutes.js file and compiles all the HTML files into JavaScript files.
 *
 * @param {string} rootDir - The root directory of the project.
 * @param {string} prebuildDir - The directory where the prebuild files will be stored.
 */
export function prebuildSpa(rootDir, prebuildDir) {
  const copySources = (source) => copy(path.join(rootDir, source), path.join(prebuildDir, source));
  copySources("index.html");
  copySources("public");
  copySources("src/assets");

  const entryPath = findFile([rootDir, `${rootDir}src`], ["app.js", "index.js", "main.js"]);
  const entryBuildPath = path.join(prebuildDir, entryPath);
  copy(entryPath, entryBuildPath);

  const routesPath = findFile([`${rootDir}src`, `${rootDir}src/config`], ["defineRoutes.js"]);
  const routesBuildPath = path.join(prebuildDir, routesPath);
  ensureDirectoryExists(path.dirname(routesBuildPath));
  const routesContent = fs.readFileSync(routesPath, "utf8");
  fs.writeFileSync(routesBuildPath, routesContent.replace(/.html/g, ".js"), "utf8");

  const htmlList = findHtmlFiles(`${rootDir}src/app`);

  htmlList.forEach((htmlPath) => {
    const htmlContent = fs.readFileSync(htmlPath, "utf8");
    const jsPath = path.join(prebuildDir, htmlPath.replace(".html", ".js"));
    ensureDirectoryExists(path.dirname(jsPath));
    const jsContent = compileComponent(htmlContent, htmlPath);
    fs.writeFileSync(jsPath, jsContent.replace(/.html/g, ".js"), "utf8");
  });
}

function findHtmlFiles(dir) {
  const fileList = [];
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      fileList.push(...findHtmlFiles(filePath));
    } else if (filePath.endsWith(".html")) {
      fileList.push(filePath);
    }
  });
  return fileList;
}
