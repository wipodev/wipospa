import { loadComponent } from "/lib/wi.js";

loadComponent({
  component: "home",
  selector: "body",
  initFunction: () => console.log("Home page loaded"),
});
