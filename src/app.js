import { Router } from "/lib/winify.js";
import { config } from "/lib/winify.config.js";

const router = Router(config);

window.addEventListener("load", () => {
  router.init();
});
