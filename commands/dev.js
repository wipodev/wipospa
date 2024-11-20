import { createServer } from "vite";
import { replaceWiviewImports } from "wiview/plugin";
import { getConfig } from "./utils.js";

export async function dev(options) {
  const config = await getConfig(options.root);

  const finalOptions = {
    root: options.root || config.root || "./",
    port: options.port || config.port || 3000,
  };

  try {
    const server = await createServer({
      root: finalOptions.root,
      plugins: [replaceWiviewImports()],
      server: {
        port: finalOptions.port,
      },
    });

    await server.listen();

    server.printUrls();
  } catch (error) {
    console.error("Error starting Vite server:", error);
  }
}
