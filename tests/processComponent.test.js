import componentProcessor from "../lib2/processComponent.js";
import { getTestCases } from "./cases.js";

function componentProcessorTest(component, componentName) {
  return componentProcessor(component, componentName).templateContent;
}

defineTestCases("processComponent", componentProcessorTest, getTestCases());
