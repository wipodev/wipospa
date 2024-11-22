import { exec } from "child_process";
import { getConfig } from "./utils.js";

export async function deploy(options) {
  const config = await getConfig(options.root);

  const finalOptions = {
    outDir: options.outDir || config.build?.outDir || "dist",
  };

  try {
    const ghPagesProcess = exec(`gh-pages -d ${finalOptions.outDir}`);

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
