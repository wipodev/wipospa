import { exec } from "child_process";

export function deploy() {
  const ghPagesProcess = exec("gh-pages -d dist");

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
}
