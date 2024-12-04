import { compileComponent } from "../compiler.js";
import { testCases, expectedOutputs, getBase } from "./cases.js";

function getFullTestCases() {
  const witestsCases = {};

  Object.entries(testCases).forEach(([caseName, input]) => {
    const expected = expectedOutputs[caseName];
    if (expected !== undefined) {
      const fullExpected = getBase({ componentName: caseName, ...expected });
      witestsCases[caseName] = { input: [input, caseName], expected: fullExpected };
    } else {
      console.warn(`No expected output for case: ${caseName}`);
    }
  });

  return witestsCases;
}

defineTestCases("compileComponent", compileComponent, getFullTestCases());
