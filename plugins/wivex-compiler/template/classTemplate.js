export function generateClassTemplate({
  componentName,
  imports,
  props,
  state,
  subscriptions,
  bindMethods,
  styleContent,
  methods,
  templateContent,
  container,
}) {
  return `${imports}

class ${componentName} {
  constructor(props = {}) {
    this.id = Math.random().toString(36).substring(2, 9);
    ${props}
    this.subscriptions = {};
    this.state = {};
    ${state}
    ${subscriptions}
    ${bindMethods}
    ${styleContent ? "this.ensureStyles();" : ""}
  }

  defineReactiveProperty(obj, key, initialValue) {
    let value = initialValue;
    this.subscriptions[key] = [];
    Object.defineProperty(obj, key, {
      get: () => value,
      set: (newValue) => {
        value = newValue;
        this.subscriptions[key].forEach((callback) => callback());
      },
    });
  }

  ${styleContent}

  ${methods}

  updateComponent(currentRender, newRender) {
    if (!currentRender || !newRender) return;

    const currentChildren = Array.from(currentRender.childNodes);
    const newChildren = Array.from(newRender.childNodes);

    newChildren.forEach((newChild, index) => {
      if (!newChild.hasAttribute("data-component-id")) {
        const currentChild = currentChildren[index];

        if (currentChild && currentChild.isEqualNode(newChild)) {
          return;
        }

        const existingNode = currentChildren.find((child) => child.isEqualNode(newChild));
        if (existingNode) {
          currentRender.insertBefore(existingNode, currentChild || null);
        } else {
          currentRender.insertBefore(newChild.cloneNode(true), currentChild || null);
        }
      }
    });

    currentChildren.forEach((currentChild) => {
      if (!currentChild.hasAttribute("data-component-id")) {
        if (!newChildren.some((newChild) => newChild.isEqualNode(currentChild))) {
          currentRender.removeChild(currentChild);
        }
      }
    });
  }

  render(container = null) {
    ${templateContent}

    if (container) {
      container.appendChild(${container});
    } else {
      const el = document.querySelector(\`[data-component-id="${componentName}-\${this.id}"]\`);
      this.updateComponent(el, ${container});
    }

    return ${container};
  }

  mount(container) {
    this.render(container);
  }
}

export default ${componentName};`;
}
