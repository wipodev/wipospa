import compileComponent from "../lib2/componentCompiler.js";

export function WivexCompiler() {
  return {
    name: "wivex-compiler",
    apply: "serve",
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
