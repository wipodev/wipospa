import path from "path";
import { ProcessComponent } from "./process/componentProcessor.js";
import { generateClassTemplate } from "./template/classTemplate.js";

export function compileComponent(sourceCode, filePath) {
  const componentName = path.basename(filePath, ".html").replace(/[-_]/g, "");
  const component = ProcessComponent(sourceCode, componentName);

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
    .map(([_, value]) => `${value}`)
    .join("\n");
  const beforeMount = component.scriptContent.lifecycle.beforeMount;
  const mounted = component.scriptContent.lifecycle.mounted;

  return generateClassTemplate({
    componentName,
    imports: component.scriptContent.imports,
    props: props ? `this.props = { ${props}, ...props };` : "this.props = props;",
    state,
    subscriptions,
    bindMethods,
    beforeMount,
    mounted,
    styles: component.styleContent.styles,
    methods,
    templateContent: component.templateContent,
    container: component.container,
    headContent: component.headContent.headContent,
  });
}
