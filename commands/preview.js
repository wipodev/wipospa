import { preview } from "vite";

export async function previewer(options) {
  let config = {};

  const configPtath = `${options.root || "."}/wiview.config.js`;
  if (fs.existsSync(configPtath)) {
    try {
      config = (await import(configPtath)).default || {};
    } catch (error) {
      console.error("Error loading wiview.config.js:", error);
    }
  }

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
