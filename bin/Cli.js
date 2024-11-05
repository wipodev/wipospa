#!/usr/bin/env node

import { program } from "commander";
import { getVersion } from "../lib/utils.js";

program
  .option("-m, --mode <mode>", "Execution mode (build or dev)", "build")
  .version("v" + getVersion(), "-v, --version", "Show version")
  .helpCommand()
  .parse(process.argv);

const options = program.opts();

if (options.helpCommand) {
  program.outputHelp();
  process.exit(0);
}

const mode = options.mode;

if (mode === "dev") {
  const runtime = await import("../scripts/dev.js");
  runtime.modeDev();
} else if (mode === "build") {
  const runtime = await import("../scripts/build.js");
  runtime.default();
}
