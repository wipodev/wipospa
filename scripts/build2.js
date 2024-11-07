import { ensureDirectoryExists, copy, minifyJavaScript } from "../lib/utils.js";

export function modeBuild(originPath, distPath, ModulePath) {
  ensureDirectoryExists("dist");
  minifyJavaScript(`${originPath}/app.js`, `${distPath}/app.js`);
  minifyJavaScript(`${ModulePath}/core.js`, `${distPath}/scripts/wiview.js`);
  minifyJavaScript(`${originPath}/scripts/routes.js`, `${distPath}/scripts/routes.js`);
  copy(`${originPath}/index.html`, `${distPath}/index.html`);
  copy(`${originPath}/assets`, `${distPath}/assets`);
  copy(`${originPath}/app`, `${distPath}/app`);
}
