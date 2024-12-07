import { Router } from "wivex";
import { routes } from "./config/defineRoutes.js";

const router = new Router(routes);
router.init();
