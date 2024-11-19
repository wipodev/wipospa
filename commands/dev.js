import { createServer } from "vite";
import { replaceWiviewImports } from "wiview/plugin";

export async function dev(options) {
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
