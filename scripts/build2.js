import { ensureDirectoryExists, copy, minifyJavaScript } from "../lib/utils.js";

export function modeBuild() {
  ensureDirectoryExists("dist");
  minifyJavaScript("app.js", "dist/app.js");
  minifyJavaScript("../src/core.js", "dist/scripts/wiview.js");
  minifyJavaScript("scripts/wiview.config.js", "dist/scripts/wiview.config.js");
  copy("index.html", "dist/index.html");
  copy("assets", "dist/assets");
  copy("app", "dist/app");
}
