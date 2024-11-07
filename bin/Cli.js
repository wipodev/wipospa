#!/usr/bin/env node

import { program } from "commander";
import { getVersion } from "../lib/utils.js";

program.version("v" + getVersion(), "-v, --version", "Show version").helpCommand();

program
  .command("init")
  .description("Initialize the project")
  .action(async () => {
    const runtime = await import("../scripts/init.js");
    runtime.init();
  });

program
  .command("dev")
  .description("Run development mode")
  .option("-p, --path <path>", "Specify the base path", "src")
  .option("-m, --module-path <path>", "Specify the base module path", "node_modules/wiview/src")
  .action(async (cmd) => {
    const runtime = await import("../scripts/dev.js");
    runtime.modeDev(cmd.path, cmd.modulePath);
  });

program
  .command("build")
  .description("Run build mode")
  .action(async () => {
    const runtime = await import("../scripts/build2.js");
    runtime.modeBuild();
  });

program
  .command("preview")
  .description("preview built web")
  .action(async () => {
    const runtime = await import("../scripts/preview.js");
    runtime.preview();
  });

program
  .command("deploy")
  .description("deploy to gh-pages")
  .action(async () => {
    const runtime = await import("../scripts/deploy.js");
    runtime.deploy();
  });

program.parse(process.argv);
