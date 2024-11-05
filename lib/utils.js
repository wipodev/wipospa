import { readFileSync, existsSync, statSync, mkdirSync, copyFileSync, readdirSync } from "fs";
import { join } from "path";

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
