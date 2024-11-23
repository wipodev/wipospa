import fs from "fs";
import http from "http";
import { createServer } from "vite";
import { replaceWivexImports } from "wivex/plugin";
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
      plugins: [replaceWivexImports()],
      server: {
        port: finalOptions.port,
      },
    });

    await server.listen();
    const url = `http://localhost:${finalOptions.port}`;

    const depsPath = "./node_modules/.vite/deps/_metadata.json";
    if (!fs.existsSync(depsPath)) {
      await new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
          res.on("data", () => {});
          res.on("end", resolve);
        });
        req.on("error", reject);
        req.end();
      });

      await new Promise((resolve) => {
        const interval = setInterval(async () => {
          if (fs.existsSync(depsPath)) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });

      await server.close();
      return dev(options);
    }

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
