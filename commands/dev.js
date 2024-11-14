import { createServer } from "vite";

export async function dev(options) {
  try {
    const server = await createServer({
      root: options.root,
      server: {
        port: 3000,
      },
    });

    await server.listen();

    server.printUrls();
  } catch (error) {
    console.error("Error starting Vite server:", error);
  }
}
