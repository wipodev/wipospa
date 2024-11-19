import { registerComponent, Router } from "wiview";
import { components } from "./config/defineComponents.js";
import { routes } from "./config/defineRoutes.js";

registerComponent(components);
const router = Router(routes);

window.addEventListener("load", () => {
  router.init();
});
