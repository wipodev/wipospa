import { headProcessor } from "./processHead.js";
import { styleProcessor } from "./processStyles.js";
import { scriptProcessor } from "./processScripts.js";

export const templateProcessor = (template) => {
  const { templateWithoutHead, headContent } = headProcessor(template);
  const { templateWithoutScript, scriptContent } = scriptProcessor(templateWithoutHead);
  const { templateWithoutStyle, styleContent } = styleProcessor(templateWithoutScript);
  const templateContent = templateWithoutStyle;
  return { templateContent, headContent, scriptContent, styleContent };
};
