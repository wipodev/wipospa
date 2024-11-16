import { registerComponent, Router } from "wiview";
import { components } from "./defineComponents.js";
import { routes } from "./routes/defineRoutes.js";

registerComponent(components);
const router = Router(routes);

window.addEventListener("load", () => {
  router.init();
});
