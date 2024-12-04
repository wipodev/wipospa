import * as cheerio from "cheerio";

export function headProcessor(html) {
  const $ = cheerio.load(html);
  const headContent = $("wivex\\:head").html();
  const fullTag = $("wivex\\:head").toString();
  const startIndex = html.indexOf(fullTag);
  const endIndex = startIndex + fullTag.length;
  const indexes = { start: startIndex, end: endIndex };
  return { headContent, indexes };
}
