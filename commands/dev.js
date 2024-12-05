import { createServer } from "vite";
import { WivexCompiler } from "wivex/plugin";
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
      plugins: [WivexCompiler()],
      resolve: {
        alias: {
          "@components": `${finalOptions.root}/src/app/components/`,
        },
      },
      server: {
        port: finalOptions.port,
      },
    });

    await server.listen();
    server.printUrls();

    process.on("SIGINT", async () => {
      console.log("\nClosing development server...");
      await server.close();
      process.exit(0);
    });
  } catch (error) {
    console.error("Error starting Vite server:", error);
  }
}
