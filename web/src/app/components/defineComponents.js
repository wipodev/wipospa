import TitleLib from "./Title_Lib.html";
import DarkToggle from "./Dark_Toggle.html";
import HeaderPage from "./Header_Page.html";
import FooterPage from "./Footer_Page.html";

export const components = {
  TitleLib: { template: TitleLib },
  DarkToggle: { template: DarkToggle, state: { theme: "sun" } },
  HeaderPage: { template: HeaderPage, state: { menu: "" } },
  FooterPage: { template: FooterPage },
};
