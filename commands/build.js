import { build } from "vite";
import fs from "fs";
import { precompileComponentRegistry } from "../plugins/precompile-component-registry.js";
import { move } from "./utils.js";

export async function builder(options) {
  if (options.mode === "SPA") {
    precompileComponentRegistry("./");
  }
  try {
    await build({
      root: options.root,
      base: options.base,
      build: {
        outDir: options.outDir,
      },
    });

    move("./precompiled/dist", "./dist");
    console.log("Build completed!");
    fs.rmSync("./precompiled", { recursive: true, force: true });
  } catch (error) {
    console.error("Error during build:", error);
  }
}
