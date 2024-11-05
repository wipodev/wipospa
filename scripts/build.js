#!/usr/bin/env node

import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { ensureDirectoryExists, copy } from "../lib/utils.js";

async function processLayout(route) {
  const layoutContent = fs.readFileSync(route, "utf8");
  const $index = cheerio.load(fs.readFileSync("index.html", "utf8"));
  const $layout = extractStyles(layoutContent, "layout");
  const script = $layout("script").html();

  $layout("script").remove();

  $index("body").html($layout.html());
  $index("head").append('<link rel="stylesheet" href="app/css/layout.css">');

  if (script) {
    if (script.includes("loadComponent")) {
      const components = extractComponents(script);
      components.forEach(({ component, selector, replaceContent }) => {
        const routeComponent = path.join(process.cwd(), component);
        const componentHtml = fs.readFileSync(routeComponent, "utf8");
        const $comp = cheerio.load(componentHtml);
        if (replaceContent) {
          $index(selector).html($comp.html());
        } else {
          $index(selector).append($comp.html());
        }
      })
    }else {
    const scriptFileName = `dist/app/js/${path.basename("layout", ".html")}_script.js`;
    ensureDirectoryExists("dist/app/js");
    fs.writeFileSync(scriptFileName, script);
    $index("body").append(`<script src="${scriptFileName}"></script>`);
    }
  }

  fs.writeFileSync("dist/index.html", $index.html());
  console.log("Archivo index.html actualizado y guardado en la carpeta dist.");
}

function extractStyles(html, name) {
  const $ = cheerio.load(html);
  const styles = $("style").html();
  if (styles) {
    ensureDirectoryExists("dist/app/css");
    fs.writeFileSync(`dist/app/css/${name}.css`, styles);
    console.log(`CSS extraído a ${name}.css`);
  }
  $("style").remove();

  return $
}

function extractComponents(scriptContent) {
  const regex =
    /loadComponent\(\{\s*component:\s*["'](.+?)["'],\s*selector:\s*["'](.+?)["'],?\s*(replaceContent:\s*(true|false))?\s*\}\)/g;
  let match;
  const components = [];

  while ((match = regex.exec(scriptContent)) !== null) {
    const component = match[1];
    const selector = match[2];
    const replaceContent = match[4] === "true";
    components.push({ component, selector, replaceContent });
  }
  return components;
}

export async function modeBuild() {
  ensureDirectoryExists("dist");
  const configPath = path.resolve(process.cwd(), "wiview.config.js");

  if (!fs.existsSync(configPath)) {
    throw new Error("No se encontró el archivo wiview.config.js en el proyecto.");
  }
  const configUrl = pathToFileURL(configPath);
  const { config } = await import(configUrl.href);
  if (config.layout) {
    await processLayout(config.layout);
  }
}
