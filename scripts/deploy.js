import fs from "fs";
import { pathToFileURL } from "url";
import path from "path";
import { exec } from "child_process";

export async function deploy(dir, configPath) {
  configPath = path.join(process.cwd(), configPath);
  let base = "/";

  if (!fs.existsSync(dir)) {
    throw new Error(`Directory ${dir} does not exist.`);
  }
  if (fs.existsSync(configPath)) {
    const { default: config } = await import(pathToFileURL(configPath));
    base = config.base;
  }

  const result = preDeploy(path.join(process.cwd(), dir), base);

  if (result) {
    const ghPagesProcess = exec(`gh-pages -d ${dir}`);

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
  } else {
    console.error("Deployment failed");
  }
}

function preDeploy(distFolder, base) {
  try {
    fs.readdirSync(distFolder).forEach((file) => {
      const filePath = path.join(distFolder, file);
      const fileStats = fs.statSync(filePath);

      if (fileStats.isDirectory()) {
        preDeploy(filePath, base);
      } else {
        const fileExtension = path.extname(file);

        if (fileExtension === ".html" || fileExtension === ".js") {
          let content = fs.readFileSync(filePath, "utf8");
          content = content.replace(/"assets\//g, `"${base}assets/`);
          content = content.replace(/"\/assets\//g, `"${base}assets/`);
          content = content.replace(/"app\.js/g, `"${base}app.js`);
          content = content.replace(/"\/app\.js/g, `"${base}app.js`);
          content = content.replace(/"scripts\//g, `"${base}scripts/`);
          content = content.replace(/"\/scripts\//g, `"${base}scripts/`);
          content = content.replace(/"app\//g, `"${base}app/`);
          content = content.replace(/"\/app\//g, `"${base}app/`);
          const regex = new RegExp(`<a\\s+href="\\/(?!${base.replace(/^\/|\/$/g, "")}\\/)([^"]*)"`, "g");
          content = content.replace(regex, `<a href="${base}$1"`);
          fs.writeFileSync(filePath, content);
        }
      }
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
