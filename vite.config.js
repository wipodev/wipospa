import { defineConfig } from "vite";

export default defineConfig({
  build: {
    minify: false,
    lib: {
      entry: "./router/index.js",
      name: "wivex",
      fileName: (format) => `wivex.${format}.js`,
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
