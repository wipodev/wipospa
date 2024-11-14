import { build } from "vite";

export async function builder(options) {
  try {
    await build({
      root: options.root,
      base: options.base,
      build: {
        outDir: options.outDir,
      },
    });

    console.log("Build completed!");
  } catch (error) {
    console.error("Error during build:", error);
  }
}
