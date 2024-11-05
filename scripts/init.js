import fs from "fs";
import path from "path";
import { copy } from "../lib/utils.js";

const packageJsonPath = path.resolve(process.cwd(), "package.json");

export function init() {
  console.log("Initializing the project...");
  copy("../template", ".");

  try {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    pkg.scripts = {
      ...pkg.scripts,
      dev: "wiview dev",
      build: "wiview build",
      preview: "wiview preview",
      deploy: "wiview deploy",
    };
    fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2), "utf8");
    console.log("Project initialized.");
  } catch (err) {
    console.error("Error initializing the project:", err);
  }
}
