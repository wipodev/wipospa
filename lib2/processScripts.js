import * as cheerio from "cheerio";

export function scriptProcessor(html) {
  const scriptContent = {
    imports: "",
    state: {},
    props: {},
    methods: {},
  };
  const importRegex = /import\s+[^;]+;?/g;
  const stateRegex = /let\s+(\w+)\s*(?:=\s*([^;]+))?\s*;?/g;
  const propsRegex = /var\s+(\w+)\s*(?:=\s*([^;]+))?\s*;?/g;
  const functionRegex = /function\s+(\w+)\s*\((.*?)\)\s*\{([\s\S]*?)\}/g;
  const functionRegex2 =
    /(?:function\s+(\w+)\s*\(.*?\)\s*\{[\s\S]*?\}|const\s+(\w+)\s*=\s*\(.*?\)\s*=>\s*\{[\s\S]*?\})/g;

  const $ = cheerio.load(html);
  const stringCode = $("script").html();
  $("script").remove();
  const templateWithoutScript = $.html();

  if (stringCode) {
    let match;
    while ((match = importRegex.exec(stringCode))) {
      scriptContent.imports += `${match}\n`;
    }
    while ((match = stateRegex.exec(stringCode))) {
      const [, stateName, stateValue] = match;
      scriptContent.state[stateName] = stateValue || "";
    }
    while ((match = propsRegex.exec(stringCode))) {
      const [, propName, propValue] = match;
      scriptContent.props[propName] = propValue || "";
    }
    while ((match = functionRegex2.exec(stringCode))) {
      const fullFunc = match[0];
      const name = match[1] || match[2];

      if (!name) continue;

      const updatedFunc = [
        ...Object.entries(scriptContent.state).map(([key]) => [key, "state"]),
        ...Object.entries(scriptContent.props).map(([key]) => [key, "props"]),
      ].reduce((func, [key, prefix]) => {
        const regex = new RegExp(`\\b${key}\\b`, "g");
        return func.replace(regex, `${prefix}.${key}`);
      }, fullFunc);

      scriptContent.methods[name] = updatedFunc;
    }
  }

  return { templateWithoutScript, scriptContent };
}
