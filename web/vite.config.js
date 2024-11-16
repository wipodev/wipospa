import { defineConfig } from "vite";
import { replaceWiviewImports } from "wiview/plugin";

export default defineConfig({
  plugins: [replaceWiviewImports()],
});
