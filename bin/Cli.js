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
  .action(async () => {
    const runtime = await import("../scripts/dev.js");
    runtime.modeDev();
  });

program
  .command("build")
  .description("Run build mode")
  .action(async () => {
    const runtime = await import("../scripts/build2.js");
    runtime.modeBuild();
  });

program.parse(process.argv);
