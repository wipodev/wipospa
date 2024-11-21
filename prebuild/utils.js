import fs from "fs";
import path from "path";
import { copy, move, ensureDirectoryExists } from "../commands/utils.js";
export { copy, move, ensureDirectoryExists };

export function findFile(directories, files) {
  for (let dir of directories) {
    for (let file of files) {
      const filePath = path.join(dir, file);
      if (fs.existsSync(filePath)) {
        return filePath;
      }
    }
  }
  throw new Error("No file found.");
}
