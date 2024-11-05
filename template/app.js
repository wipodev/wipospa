import { Router } from "/lib/wiview.js";
import { config } from "/lib/wiview.config.js";

const router = Router(config);

window.addEventListener("load", () => {
  router.init();
});
