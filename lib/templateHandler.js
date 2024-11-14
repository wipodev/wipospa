export const interpolateTemplate = (component, props) => {
  for (const key in props) {
    if (props.hasOwnProperty(key)) {
      const propKey = new RegExp(`{${key}}`, "gi");
      component = component.replace(propKey, (match) => props[key]);
    }
  }
  return component;
};
