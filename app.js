import { Router } from "/wiview/scripts/wiview.js";
import { config } from "/wiview/scripts/wiview.config.js";

const router = Router(config);

window.addEventListener("load", () => {
  router.init();
});
