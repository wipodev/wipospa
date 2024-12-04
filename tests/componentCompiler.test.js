import { compileComponent } from "../lib2/componentCompiler.js";
import { getFullTestCases } from "./cases.js";

defineTestCases("compileComponent", compileComponent, getFullTestCases());
