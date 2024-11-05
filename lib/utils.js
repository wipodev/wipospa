import { readFileSync, existsSync, statSync, mkdirSync, copyFileSync, readdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { minify } from "terser";

export function getVersion() {
  return JSON.parse(readFileSync("package.json", "utf8")).version;
}

export function copy(source, destination, replace = true) {
  if (!existsSync(source)) {
    throw new Error(`Source path "${source}" does not exist.`);
  }
  const sourceStats = statSync(source);
  if (sourceStats.isFile()) {
    const destDir = join(destination, "..");
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }
    if (!replace && existsSync(destination)) {
      return;
    }
    copyFileSync(source, destination);
  } else if (sourceStats.isDirectory()) {
    ensureDirectoryExists(destination);
    const items = readdirSync(source);
    for (const item of items) {
      const sourceItem = join(source, item);
      const destItem = join(destination, item);
      copy(sourceItem, destItem);
    }
  }
}

export function ensureDirectoryExists(dir) {
  const outputPath = join(process.cwd(), dir);
  if (!existsSync(outputPath)) {
    mkdirSync(outputPath, { recursive: true });
  }
  return outputPath;
}

export async function minifyJavaScript(inputPath, outputPath) {
  try {
    const jsContent = readFileSync(inputPath, "utf8");
    const minified = await minify(jsContent);

    ensureDirectoryExists(dirname(outputPath));
    writeFileSync(outputPath, minified.code, "utf8");

    console.log(`Minified file saved in: ${outputPath}`);
  } catch (error) {
    console.error("Error minifying file:", error);
  }
}
