import fs from "fs";
import compileComponent from "../lib/compileComponents.js";

export function WivexCompiler() {
  const root = path.posix.join(process.cwd().replace(/\\/g, "/"), "node_modules/.vite/deps/wivex.js");
  return {
    name: "wivex-compiler",
    apply: "serve",
    transform(code, id) {
      if (id.endsWith(".html")) {
        const compiledCode = compileComponent(code);

        const map = {
          version: 3,
          file: id,
          sources: [id],
          names: ["getState"],
          mappings:
            "AAAA,SAASA,OAAO,CAAC,GAAR,CAAY,SAAZ,CAAA,CAAA;AAGzB,OAAO,CAAC,GAAR,CAAY,SAAZ,CAAA,CAAA,OAAO,CAAC,GAAR,CAAY,SAAR,CAAA,CAAA,CAAA,OAAO,OAAO,OAAO,OAAO,OAAO,CAAA,OAAO,OAAO,OAAO,OAAO,CAAA,OAAO,OAAO,CAAA,OAAO,OAAO,OAAO,OAAO,OAAO;AAAA",
        };

        return {
          code: compiledCode,
          map: map,
        };
      }
      return null;
    },
  };
}
