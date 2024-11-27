import * as cheerio from "cheerio";

export function headProcessor(html) {
  const $ = cheerio.load(html);
  const headContent = $("wivex\\:head").html();
  $("wivex\\:head").remove();
  const templateWithoutHead = $.html();
  return { templateWithoutHead, headContent };
}
