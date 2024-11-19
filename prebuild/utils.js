import fs from "fs";
import path from "path";
import { copy, move } from "../commands/utils.js";
export { copy, move };

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
