import { readFileSync } from "fs";

/**
 * Vite plugin to replace 'import { ... } from "wiview"' to
 * 'import { ... } from "/node_modules/.vite/deps/wiview.js?v=<browserHash>"'
 * in HTML files, and wrap the code with 'export default `<code>`'.
 * This is necessary because Vite's built-in HTML plugin does not support
 * imports in HTML files.
 *
 * @returns {import("vite").Plugin} Vite plugin.
 */
export function replaceWiviewImports() {
  return {
    name: "replace-wiview-import",
    apply: "serve",
    transform(code, id) {
      if (id.endsWith(".html")) {
        const jsonPath = "./node_modules/.vite/deps/_metadata.json";
        const jsonData = JSON.parse(readFileSync(jsonPath, "utf-8"));
        const modifiedCode = code.replace(
          /import\s+{([^}]+)}\s+from\s+['"]wiview['"]/g,
          `import { $1 } from '/node_modules/.vite/deps/wiview.js?v=${jsonData.browserHash}'`
        );

        const exportTemplate = `
            export default \`${modifiedCode}\`;
          `;

        const map = {
          version: 3,
          file: id,
          sources: [id],
          names: ["getState"],
          mappings:
            "AAAA,SAASA,OAAO,CAAC,GAAR,CAAY,SAAZ,CAAA,CAAA;AAGzB,OAAO,CAAC,GAAR,CAAY,SAAZ,CAAA,CAAA,OAAO,CAAC,GAAR,CAAY,SAAR,CAAA,CAAA,CAAA,OAAO,OAAO,OAAO,OAAO,OAAO,CAAA,OAAO,OAAO,OAAO,OAAO,CAAA,OAAO,OAAO,CAAA,OAAO,OAAO,OAAO,OAAO,OAAO;AAAA",
        };

        return {
          code: exportTemplate,
          map: map,
        };
      }
      return null;
    },
  };
}
