import { preview } from "vite";
import { getConfig } from "./utils.js";

export async function previewer(options) {
  const config = await getConfig(options.root);

  const finalOptions = {
    root: options.root || config.root || "./",
  };

  try {
    const server = await preview({
      root: finalOptions.root,
      preview: {
        port: 8080,
        open: true,
      },
    });

    server.printUrls();
  } catch (error) {
    console.error("Error starting Vite server:", error);
  }
}
