import fs from "fs";

/**
 * Vite plugin to replace 'import { ... } from "wivex"' to
 * 'import { ... } from "/node_modules/.vite/deps/wivex.js?v=<browserHash>"'
 * in HTML files, and wrap the code with 'export default `<code>`'.
 * This is necessary because Vite's built-in HTML plugin does not support
 * imports in HTML files.
 *
 * @returns {import("vite").Plugin} Vite plugin.
 */
export function replaceWivexImports() {
  const root = path.posix.join(process.cwd().replace(/\\/g, "/"), "node_modules/.vite/deps/wivex.js");
  return {
    name: "replace-wivex-import",
    apply: "serve",
    transform(code, id) {
      if (id.endsWith(".html")) {
        const jsonPath = "./node_modules/.vite/deps/_metadata.json";
        let modifiedCode;
        if (fs.existsSync(jsonPath)) {
          const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
          modifiedCode = code.replace(
            /import\s+{([^}]+)}\s+from\s+['"]wivex['"]/g,
            `import { $1 } from '/@fs/${root}?v=${jsonData.browserHash}'`
          );
        }

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
