import TitleLib from "./Title_Lib.html";
import DarkToggle from "./Dark_Toggle.html";
import HeaderPage from "./Header_Page.html";
import FooterPage from "./Footer_Page.html";
import Layout from "../Layout.html";
import Home from "./home.html";
import About from "./about.html";

export const components = {
  TitleLib: { template: TitleLib },
  DarkToggle: { template: DarkToggle, state: { theme: "sun" } },
  HeaderPage: { template: HeaderPage, state: { menu: "" } },
  FooterPage: { template: FooterPage },
  Layout: { template: Layout },
  Home: { template: Home },
  About: { template: About },
};
