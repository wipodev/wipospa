import { Router } from "/scripts/wiview.js";
import { config } from "/scripts/wiview.config.js";

const router = Router(config);

window.addEventListener("load", () => {
  router.init();
});
