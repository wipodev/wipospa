#!/usr/bin/env node

import { readFileSync, rmSync, writeFileSync } from "fs";
import { exec } from "child_process";
import { join } from "path";
import * as cheerio from "cheerio";
import { config } from "winify.config.js";

const { layout, routes } = config;
const data = readFileSync("index.html", "utf8");
const $ = cheerio.load(data);
if (layout) {
  $(layout.tagMain).html();
} else {
  $("body").html();
}
