import { Router } from "/scripts/wiview.js";
import { config } from "/scripts/routes.js";

const router = Router(config);

window.addEventListener("load", () => {
  router.init();
});
