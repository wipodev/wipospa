import { registerComponent, Router } from "wiview";
import { components } from "./app/components/defineComponents.js";
import { routes } from "./app/views/defineRoutes.js";

registerComponent(components);
const router = Router(routes);

window.addEventListener("load", () => {
  router.init();
});
