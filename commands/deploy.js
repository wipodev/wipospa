import { exec } from "child_process";
import { getConfig } from "./utils.js";
import path from "path";

export async function deploy(options) {
  const config = await getConfig(options.root);

  const finalOptions = {
    root: options.root || config.root || "./",
    outDir: options.outDir || config.build?.outDir || "dist",
  };

  const finalDist = path.join(finalOptions.root, finalOptions.outDir);

  try {
    const ghPagesProcess = exec(`gh-pages -d ${finalDist}`);

    ghPagesProcess.stdout.on("data", (data) => {
      console.log(data.toString());
    });

    ghPagesProcess.stderr.on("data", (data) => {
      console.error(data.toString());
    });

    process.on("SIGINT", () => {
      console.log("\nDeployment process completed");
      ghPagesProcess.kill("SIGINT");
      process.exit();
    });
  } catch (error) {
    console.error(`Deployment failed: ${error}`);
  }
}
