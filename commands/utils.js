import fs from "fs";
import path from "path";

export function getVersion() {
  return JSON.parse(fs.readFileSync("package.json", "utf8")).version;
}

export function move(source, destination, replace = true) {
  copy(source, destination, replace);
  fs.rmSync(source, { recursive: true, force: true });
}

export function copy(source, destination, replace = true) {
  try {
    if (!fs.existsSync(source)) {
      throw new Error(`Source path "${source}" does not exist.`);
    }

    const sourceStats = fs.statSync(source);

    if (sourceStats.isFile()) {
      const destDir = path.join(destination, "..");
      ensureDirectoryExists(destDir);
      if (!replace && fs.existsSync(destination)) return;
      fs.copyFileSync(source, destination);
    } else if (sourceStats.isDirectory()) {
      ensureDirectoryExists(destination);
      const items = fs.readdirSync(source);
      for (const item of items) {
        const sourceItem = path.join(source, item);
        const destItem = path.join(destination, item);

        try {
          copy(sourceItem, destItem, replace);
        } catch (error) {
          console.error(`❌ Error copying item "${item}": ${error}`);
        }
      }
    }
  } catch (error) {
    console.error(`❌ ${error}`);
  }
}

function ensureDirectoryExists(dir) {
  const outputPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }
  return outputPath;
}
