import { rmSync } from "fs";
import { exec } from "child_process";
import { join } from "path";
import { copy } from "../lib/utils.js";

export function modeDev() {
  copy("src/core.js", "dev/lib/winify.js");
  copy("src/config.js", "dev/lib/winify.config.js", false);
  copy("src/app.js", "dev/app.js");

  const servorProcess = exec("npx servor example index.html 8080 --reload");

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
      rmSync(join(process.cwd(), "/dev/lib/winify.js"));
      rmSync(join(process.cwd(), "/dev/app.js"));
    } catch (err) {
      console.error("Error deleting file:", err);
    }
    process.exit();
  });
}
