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
  const defineReactiveProperty = state
    ? `defineReactiveProperty(obj, key, initialValue) {
    let value = initialValue;
    this.subscriptions[key] = [];
    Object.defineProperty(obj, key, {
      get: () => value,
      set: (newValue) => {
        value = newValue;
        this.subscriptions[key].forEach((callback) => callback());
      }
    });
  }`
    : "";

  const updateComponent = state
    ? `updateComponent(currentNode, newNode) {
    if (!currentNode || !newNode) return;

    if (currentNode.nodeType === Node.TEXT_NODE && currentNode.textContent !== newNode.textContent) {
      currentNode.textContent = newNode.textContent;
    } else if (currentNode.nodeType === Node.ELEMENT_NODE && currentNode.tagName !== newNode.tagName) {
      currentNode.replaceWith(newNode.cloneNode(true));
    } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
      Array.from(newNode.attributes).forEach((attr) => {
        if (currentNode.getAttribute(attr.name) !== attr.value) {
          currentNode.setAttribute(attr.name, attr.value);
        }
      });

      const currentChildren = Array.from(currentNode.childNodes);
      const newChildren = Array.from(newNode.childNodes);

      const maxLen = Math.max(currentChildren.length, newChildren.length);
      for (let i = 0; i < maxLen; i++) {
        if (newChildren[i] && !currentChildren[i]) {
          currentNode.appendChild(newChildren[i].cloneNode(true));
        } else if (currentChildren[i] && !newChildren[i]) {
          currentNode.removeChild(currentChildren[i]);
        } else {
          this.updateComponent(currentChildren[i], newChildren[i]);
        }
      }
    }
  }`
    : "";

  const reRender = state
    ? `else {
      const el = document.querySelector(\`[data-component-id="${componentName}-\${this.id}"]\`);
      this.updateComponent(el, ${container});
    }`
    : "";

  return `${imports}

class ${componentName} {
  constructor(props = {}) {
    this.id = Math.random().toString(36).substring(2, 9);
    ${props}${subscriptions ? "\nthis.subscriptions = {};" : ""}${
    state ? `\nthis.state = {};\n${state}` : ""
  }${subscriptions}${bindMethods}${styleContent ? "\nthis.ensureStyles();" : ""}
  }

  ${defineReactiveProperty}

  ${styleContent}

  ${methods}

  ${updateComponent}

  render(container = null) {
    ${templateContent}

    if (container) {
      container.appendChild(${container});
    } ${reRender}

    return ${container};
  }

  mount(container, replace = false) {
    if (replace && container) {
        container.innerHTML = "";
    }
    this.render(container);
  }
}

export default ${componentName};`;
}
