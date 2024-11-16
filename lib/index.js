import { getState, updateState } from "./componentDatabase.js";
import { registerComponent } from "./componentRegistry.js";
import { render } from "./renderEngine.js";
import { Router } from "./router.js";

export { registerComponent, render, Router, getState, updateState };

export default { registerComponent, render, Router, getState, updateState };
