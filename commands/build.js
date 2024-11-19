import { build } from "vite";
import fs from "fs";
import { prebuildSpa } from "wiview/prebuild";
import { move } from "./utils.js";

export async function builder(options) {
  let config = {};

  const configPath = `${options.root || "."}/wiview.config.js`;
  if (fs.existsSync(configPath)) {
    try {
      config = (await import(configPath)).default || {};
    } catch (error) {
      console.error("Error loading wiview.config.js:", error);
    }
  }

  const finalOptions = {
    base: options.base || config.base || "/",
    root: options.root || config.root || "./",
    buildRoot: options.buildRoot || config.build?.root || "./prebuild",
    mode: options.mode || config.build?.mode || "SPA",
    outDir: options.outDir || config.build?.outDir || "dist",
  };

  if (finalOptions.mode === "SPA") {
    await prebuildSpa(finalOptions.root, finalOptions.buildRoot);
  }

  try {
    await build({
      root: finalOptions.buildRoot,
      base: finalOptions.base,
      build: {
        outDir: finalOptions.outDir,
      },
    });

    move(`${finalOptions.buildRoot}/${finalOptions.outDir}`, `${finalOptions.root}${finalOptions.outDir}`);
    console.log("Build completed!");
    fs.rmSync(finalOptions.buildRoot, { recursive: true, force: true });
  } catch (error) {
    console.error("Error during build:", error);
  }
}
