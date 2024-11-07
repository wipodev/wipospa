import { rmSync } from "fs";
import { exec } from "child_process";
import { join } from "path";
import { copy } from "../lib/utils.js";

export function modeDev(basePath, modulePath) {
  copy(`${modulePath}/core.js`, `${basePath}/scripts/wiview.js`);

  const servorProcess = exec(`servor ${basePath} index.html --reload`);

  servorProcess.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  servorProcess.stderr.on("data", (data) => {
    console.error(data.toString());
  });

  process.on("SIGINT", () => {
    console.log("\nClosing the server...");
    servorProcess.kill("SIGINT");
    try {
      rmSync(join(process.cwd(), `${basePath}/scripts/wiview.js`));
    } catch (err) {
      console.error("Error deleting file:", err);
    }
    process.exit();
  });
}
