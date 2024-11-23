import fs from "fs";
import path from "path";
import { copy } from "./utils.js";

const packageJsonPath = path.resolve(process.cwd(), "package.json");

export function init(options) {
  console.log("Initializing the project...");
  const root = options.root || ".";

  try {
    copy("../template", root);
    console.log("Template copied successfully.");

    if (fs.existsSync(packageJsonPath)) {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      pkg.scripts = {
        ...pkg.scripts,
        dev: pkg.scripts.dev || "wivex dev",
        build: pkg.scripts.build || "wivex build",
        preview: pkg.scripts.preview || "wivex preview",
        deploy: pkg.scripts.deploy || "wivex deploy",
      };
      fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2), "utf8");
      console.log("package.json updated with new scripts.");
    } else {
      console.error("Error: package.json not found.");
    }
  } catch (err) {
    console.error("Error initializing the project:", err);
  }
}
