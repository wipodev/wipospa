import * as cheerio from "cheerio";
import { headProcessor } from "./processHead.js";
import { scriptProcessor } from "./processScripts.js";
import { styleProcessor } from "./processStyles.js";

export function preprocessComponent(component) {
  const headContent = headProcessor(component);
  const scriptContent = scriptProcessor(component);
  const styleContent = styleProcessor(component);

  const $ = cheerio.load(component);
  $("wivex\\:head").remove();
  $("script").remove();
  $("style").remove();
  const preProcessedTemplate = $.html();

  return {
    preProcessedTemplate,
    scriptContent,
    headContent,
    styleContent,
  };
}
