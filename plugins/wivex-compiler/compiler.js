import path from "path";
import { componentProcessor } from "./process/processComponent.js";
import { generateClassTemplate } from "./template/classTemplate.js";

export function compileComponent(sourceCode, filePath) {
  const componentName = path.basename(filePath, ".html").replace(/[-_]/g, "");
  const component = componentProcessor(sourceCode, componentName);

  const props = Object.entries(component.scriptContent.props)
    .map(([key, value]) => {
      const valueExpression = value ? value : `""`;
      return `${key}: ${valueExpression}`;
    })
    .join(", ");
  const state = Object.entries(component.scriptContent.state)
    .map(([key, value]) => {
      const valueExpression = value ? value : `""`;
      return `this.defineReactiveProperty(this.state, "${key}", ${valueExpression});`;
    })
    .join("\n");
  const subscriptions = Object.entries(component.scriptContent.state)
    .map(([key]) => `this.subscriptions.${key}.push(() => this.render());`)
    .join("\n");
  const bindMethods = Object.entries(component.scriptContent.methods)
    .map(([key]) => `this.${key} = this.${key}.bind(this);`)
    .join("\n");
  const methods = Object.entries(component.scriptContent.methods)
    .map(([_, value]) => `${value};`)
    .join("\n");

  const styleContent = component.styleContent.styles
    ? `ensureStyles() {
    if (!document.querySelector(\`style[data-style-for="${componentName}"]\`)) {
      const style = document.createElement("style");
      style.setAttribute("data-style-for", "${componentName}");
      style.textContent = \`${component.styleContent.styles}\`;
      document.head.appendChild(style);
    }
  }`
    : "";

  return generateClassTemplate({
    componentName,
    imports: component.scriptContent.imports,
    props,
    state,
    subscriptions,
    bindMethods,
    styleContent,
    methods,
    templateContent: component.templateContent,
    container: component.container,
  });
}
