import { compileComponent } from "../lib2/componentCompiler.js";
import { getFullTestCases } from "./cases.js";

//defineTestCases("compileComponent", compileComponent, getFullTestCases());

const { input, expected } = getFullTestCases().case5;
define("case3", () => compileComponent(input[0], "case5.html"), expected);
