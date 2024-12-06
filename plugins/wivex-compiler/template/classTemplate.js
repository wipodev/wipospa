export function generateClassTemplate({
  componentName,
  imports,
  props,
  state,
  subscriptions,
  bindMethods,
  beforeMount,
  mounted,
  styleContent,
  methods,
  templateContent,
  container,
  headContent,
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

  const registerEvent = templateContent.includes("registerEventListener")
    ? `registerEventListener(element, event, callback) {
    element.addEventListener(event, callback);
    this.eventListeners.push({ element, event, callback });
  }`
    : "";

  const removeEvent = templateContent.includes("registerEventListener")
    ? `this.eventListeners.forEach(({ element, event, callback }) => {
      element.removeEventListener(event, callback);
    });
    this.eventListeners = [];
`
    : "";

  return `${imports}

class ${componentName} {
  constructor(props = {}) {
    this.id = Math.random().toString(36).substring(2, 9);${
      beforeMount ? `\nthis.beforeMount = this.beforeMount.bind(this);` : ""
    }${mounted ? `\nthis.mounted = this.mounted.bind(this);` : ""}this.destroy = this.destroy.bind(this);
    this.eventListeners = [];
    this.observer = null;
    ${props}${subscriptions ? "\nthis.subscriptions = {};" : ""}${
    state ? `\nthis.state = {};\n${state}` : ""
  }${subscriptions}${bindMethods}${styleContent ? "\nthis.ensureStyles();" : ""}
  }

  ${defineReactiveProperty}

  observeDOM(node) {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((removedNode) => {
          if (removedNode === node) {
            this.destroy();
            this.observer.disconnect();
          }
        })
      });
    });

    const parent = node.parentNode;
    if (parent) {
      this.observer.observe(parent, { childList: true });
    }
  }

  ${registerEvent}

  ${beforeMount ? beforeMount : ""}

  ${mounted ? mounted : ""}

  destroy() {
    console.log("destroy");
    ${removeEvent}
    const el = document.querySelector(\`[data-component-id="${componentName}-\${this.id}"]\`);
    const style = document.querySelector(\`style[data-style-for="${componentName}"]\`);
    if (el) el.remove();
    if (style) style.remove();
  }

  ${methods}
  
  ${styleContent}

  ${updateComponent}

  ${headContent}

  render(container = null) {
    ${templateContent}

    if (container) {
      container.appendChild(${container});
      this.observeDOM(${container});
    } ${reRender}

    return ${container};
  }

  mount(container, replace = false) {
    ${beforeMount ? `this.beforeMount();\n` : ""}if (replace && container) container.innerHTML = "";
    ${headContent ? `this.renderHead();\n` : ""}this.render(container);${mounted ? `\nthis.mounted();` : ""}
  }

  unmount() {
    this.destroy();
  }
}

export default ${componentName};`;
}
