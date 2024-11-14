import { updateHeadContent } from "./ceoHandler.js";
import { evaluateAndHandleStyles } from "./styleHandler.js";
import { extractScript } from "./scriptHandler.js";

export const processTemplate = (template) => {
  template = updateHeadContent(template);
  let { processedTemplate, scriptContent } = extractScript(template);
  processedTemplate = evaluateAndHandleStyles(processedTemplate);
  return { processedTemplate, scriptContent };
};
