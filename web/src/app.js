import { registerComponent, Router } from "wivex";
import { components } from "./config/defineComponents.js";
import { routes } from "./config/defineRoutes.js";

registerComponent(components);
const router = Router(routes);

window.addEventListener("load", () => {
  router.init();
});
