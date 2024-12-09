import { createServer } from "vite";
import { WivexCompiler } from "wivex/plugin";
import { getConfig } from "./utils.js";

export async function dev(options) {
  const config = await getConfig(options.root);

  const finalOptions = {
    root: options.root || config.root || "./",
    port: options.port || config.port || 3000,
    verbose: options.verbose || config.verbose || false,
  };

  try {
    const server = await createServer({
      root: finalOptions.root,
      plugins: [WivexCompiler()],
      server: {
        port: finalOptions.port,
      },
    });

    await server.listen();

    if (finalOptions.verbose) {
      server.printUrls();

      process.on("SIGINT", async () => {
        console.log("\nClosing development server...");
        await server.close();
        process.exit(0);
      });
    }

    return server;
  } catch (error) {
    console.error("Error starting Vite server:", error);
  }
}
