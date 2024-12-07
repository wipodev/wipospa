import { ProcessComponent } from "../../core/process/componentProcessor.js";
import { testCases, expectedOutputs } from "../cases.js";

export function getTestCases() {
  const witestsCases = {};

  Object.entries(testCases).forEach(([caseName, input]) => {
    const expected = expectedOutputs[caseName];
    if (expected !== undefined) {
      witestsCases[caseName] = { input: [input, caseName], expected: expected.templateContent };
    } else {
      console.warn(`No expected output for case: ${caseName}`);
    }
  });

  return witestsCases;
}

function ProcessComponentTest(component, componentName) {
  return ProcessComponent(component, componentName).templateContent;
}

defineTestCases("processComponent", ProcessComponentTest, getTestCases());
