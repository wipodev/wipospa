import fs from "fs";
import { build } from "vite";
import { prebuildSpa } from "./spa.js";
import { move, getConfig } from "../utils.js";

export async function builder(options) {
  const config = await getConfig(options.root);
  let inputPaths = undefined;

  const finalOptions = {
    base: options.base || config.base || "/",
    root: options.root || config.root || "./",
    buildRoot: options.prebuild || config.build?.prebuild || "./prebuild",
    mode: options.mode || config.build?.mode || "SPA",
    outDir: options.outDir || config.build?.outDir || "dist",
  };

  if (finalOptions.mode === "SPA") {
    prebuildSpa(finalOptions.root, finalOptions.buildRoot);
  } else if (finalOptions.mode === "Static") {
    inputPaths = await prebuildStatic(finalOptions.root, finalOptions.buildRoot, finalOptions.base);
  }

  try {
    await build({
      root: finalOptions.buildRoot,
      base: finalOptions.base,
      build: {
        outDir: finalOptions.outDir,
        rollupOptions: {
          input: inputPaths,
        },
      },
    });

    move(`${finalOptions.buildRoot}/${finalOptions.outDir}`, `${finalOptions.root}${finalOptions.outDir}`);
    console.log("Build completed!");
    fs.rmSync(finalOptions.buildRoot, { recursive: true, force: true });
  } catch (error) {
    console.error("Error during build:", error);
  }
}
