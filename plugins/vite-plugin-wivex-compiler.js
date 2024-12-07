import { compileComponent } from "wivex/core";

export function WivexCompiler() {
  return {
    name: "vite-plugin-wivex-compiler",
    transform(code, id) {
      if (id.endsWith(".html")) {
        const compiledCode = compileComponent(code, id);

        return {
          code: compiledCode,
          map: null,
        };
      }
      return null;
    },
  };
}
