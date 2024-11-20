import TitleLib from "../app/components/Title_Lib.html";
import DarkToggle from "../app/components/Dark_Toggle.html";
import HeaderPage from "../app/components/Header_Page.html";
import FooterPage from "../app/components/Footer_Page.html";
import Layout from "../app/Layout.html";
import Home from "../app/views/home.html";
import About from "../app/views/about.html";

export const components = {
  TitleLib: { template: TitleLib },
  DarkToggle: { template: DarkToggle, state: { theme: "sun" } },
  HeaderPage: { template: HeaderPage, state: { menu: "" } },
  FooterPage: { template: FooterPage },
  Layout: { template: Layout },
  Home: { template: Home },
  About: { template: About },
};
