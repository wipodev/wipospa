import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "./lib/index.js",
      name: "wiview",
      fileName: (format) => `wiview.${format}.js`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["commander", "vite", "gh-pages"],
      output: {
        globals: {
          commander: "commander",
          ghPages: "gh-pages",
          vite: "vite",
        },
      },
    },
  },
});
