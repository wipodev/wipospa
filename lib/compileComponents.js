export default function compileComponent(sourceCode) {
  const result = {
    imports: "",
    state: "",
    methods: {},
    render: "",
    styles: "",
  };

  const state = {};
  const props = {};

  const importRegex = /import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g;
  const scriptRegex = /<script>([\s\S]*?)<\/script>/;
  const styleRegex = /<style>([\s\S]*?)<\/style>/;
  const htmlRegex = /<template>([\s\S]*?)<\/template>/;
  const componentRegex = /<([A-Z][\w-]*)\b([^>]*)>([\s\S]*?)<\/\1>/g;

  const imports = sourceCode.match(importRegex);
  if (imports) {
    result.imports = imports.join("\n");
  }

  const scriptMatch = sourceCode.match(scriptRegex);
  if (scriptMatch) {
    const scriptContent = scriptMatch[1];

    const stateRegex = /let\s+(\w+)\s*=\s*([^;]+);/g;
    const propsRegex = /var\s+(\w+)\s*=\s*([^;]+);/g;
    const functionRegex = /function\s+(\w+)\s*\((.*?)\)\s*\{([\s\S]*?)\}/g;

    let match;
    while ((match = stateRegex.exec(scriptContent))) {
      const [_, variable, value] = match;
      result.state += `defineReactiveProperty(state, '${variable}', ${value});\n`;
      state[variable] = JSON.parse(value);
    }

    while ((match = propsRegex.exec(scriptContent))) {
      const [_, propName, defaultValue] = match;
      props[propName] = defaultValue;
    }

    while ((match = functionRegex.exec(scriptContent))) {
      const [fullFunc, name] = match;

      const updatedFunc = [
        ...Object.entries(state).map(([key]) => [key, "state"]),
        ...Object.entries(props).map(([key]) => [key, "props"]),
      ].reduce((func, [key, prefix]) => {
        const regex = new RegExp(`\\b${key}\\b`, "g");
        return func.replace(regex, `${prefix}.${key}`);
      }, fullFunc);

      result.methods[name] = updatedFunc;
    }
  }

  const htmlMatch = sourceCode.match(htmlRegex);
  if (htmlMatch) {
    let htmlContent = htmlMatch[1];

    htmlContent = htmlContent
      .replace(/<([\w-]+)\s+[^>]*data-if="([^"]+)">([\s\S]*?)<\/\1>/g, (_, tag, condition, content) => {
        return `\${${condition} ? \`<${tag}>${content}</${tag}>\` : ''}`;
      })
      .replace(
        /<([\w-]+)\s+[^>]*data-for="(\w+)\s+in\s+(\w+)"([^>]*)>([\s\S]*?)<\/\1>/g,
        (_, tag, item, list, extraAttrs, content) => {
          const repeatedElements = state[list].map((currentItem) => {
            const replacedContent = content.replace(/{([^}]+)}/g, (_, marker) => {
              if (marker.trim() === item) {
                return currentItem;
              }
              return `{${marker}}`;
            });

            const replacedAttributes = extraAttrs.replace(/{([^}]+)}/g, (_, marker) => {
              if (marker.trim() === item) {
                return currentItem;
              }
              return `{${marker}}`;
            });

            return `<${tag} ${replacedAttributes.trim()}>${replacedContent}</${tag}>`;
          });

          return repeatedElements.join("");
        }
      );

    Object.keys(state).forEach((key) => {
      htmlContent = htmlContent
        .replace(new RegExp(`\\b${key}\\b`, "g"), `state.${key}`)
        .replace(new RegExp(`{state.${key}}`, "g"), `\${state.${key}}`);
    });

    htmlContent = htmlContent.replace(componentRegex, (_, tagName, attrs) => {
      const attributes = attrs
        .trim()
        .split(" ")
        .map((attr) => {
          if (attr) {
            const [name, value] = attr.trim().split("=");
            return `${name}: ${value}`;
          }
        });
      return `\${serializeComponent(components['${tagName}'], {${attributes}})}`;
    });
    htmlContent = htmlContent.replace(/on(\w+)="(\w+)\((.*?)\)"/g, (_, event, handler, args) => {
      return `data-event="${event}:${handler}:${args}"`;
    });

    result.render = `
      const render = () => {
        const template = document.createElement('template');

        function serializeComponent(component, props = {}) {
          if (!component) return '';

          const componentInstance = component(props);
          const { content, methods, setContainer } = componentInstance;

          const id = Math.random().toString(36).substr(2, 9);
          children[id] = { methods, props, setContainer };

          const tempDiv = document.createElement('div');
          tempDiv.appendChild(content.cloneNode(true));
          tempDiv.firstElementChild.setAttribute('data-child-id', id);
          return tempDiv.innerHTML.trim();
        }

        let htmlContent = \`
          ${htmlContent.trim()}
        \`;

        Object.entries(props).forEach(([key, value]) => {
          htmlContent = htmlContent.replace(new RegExp(\`{\${key}}\`, 'gi'), value);
        });

        template.innerHTML = htmlContent;

        const content = template.content.cloneNode(true);

        content.querySelectorAll('[data-event]').forEach((el) => {
          const [event, handler, args] = el.getAttribute('data-event').split(':');
          const childId = el.closest('[data-child-id]')?.getAttribute('data-child-id');

          if (childId && children[childId]?.methods[handler]) {
            el.addEventListener(event, (e) => {
              children[childId].methods[handler](...args.split(',').map(arg => arg.trim()));
            });
          }

          if (childId) {
            const element = content.querySelector(\`[data-child-id="\${childId}"]\`);
            children[childId].setContainer(element);
          }
        });

        if (container) {
          const tempDiv = document.createElement('div');
          tempDiv.appendChild(content.cloneNode(true));
          const element = tempDiv.firstElementChild;
          //tempDiv.firstElementChild.setAttribute('data-child-id', id);
          container.innerHTML = element.innerHTML.trim();
        }

        /* if (container) {
          container.innerHTML = '';
          container.appendChild(content);
        } */
        return {content, methods, setContainer};
      };
    `;
  }

  const styleMatch = sourceCode.match(styleRegex);
  if (styleMatch) {
    result.styles = `
      const style = document.createElement('style');
      style.innerHTML = \`${styleMatch[1].trim()}\`;
      document.head.appendChild(style);
    `;
  }

  const methods = Object.entries(result.methods || {})
    .map(([name, func]) => `${name}: ${func}`)
    .join(",\n");

  const finalProps = Object.entries(props || {})
    .map(([name, value]) => `${name}: ${value}`)
    .join(",\n");

  return `
${result.imports}

export default function Component(passedProps = {}) {
  const props = {
  ...{${finalProps}},
  ...passedProps
  };
  let container = null;
  const state = {};
  const subscriptions = {};
  const children = {};
  const methods = {${methods}};
  const components = {
  ${(imports || [])
    .map((imp) => {
      const name = imp.match(/import\s+(\w+)/)[1];
      return `${name}: ${name}`;
    })
    .join(",\n")}
  };

  function setContainer(newContainer) {
    container = newContainer;
  }

  function defineReactiveProperty(obj, key, initialValue) {
    let value = initialValue;
    subscriptions[key] = [];
    Object.defineProperty(obj, key, {
      get: () => value,
      set: (newValue) => {
        value = newValue;
        subscriptions[key].forEach((callback, index) => {
          callback()
        });
      },
    });
  }

  ${result.state}

  ${result.styles}

  ${result.render}

  Object.keys(subscriptions).forEach(key => subscriptions[key].push(render));

  return render();
}
  `;
}
