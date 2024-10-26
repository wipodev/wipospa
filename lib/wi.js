export const loadComponent = async (options = {}) => {
  const { component, selector, initFunction = null, replaceContent = true, fetchOptions = {} } = options;

  try {
    const response = await fetch(`/components/html/${component}.html`, fetchOptions);
    if (!response.ok) {
      throw new Error(`Failed to load component: ${component}`);
    }
    const content = await response.text();
    const container = document.querySelector(selector);

    if (container) {
      container.innerHTML = replaceContent ? content : container.innerHTML + content;
      if (initFunction) {
        initFunction();
      }
    } else {
      console.warn(`Selector not found: ${selector}`);
    }
  } catch (error) {
    console.error(error);
  }
};
