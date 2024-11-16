export const renderScripts = (scripts) => {
  if (scripts.length > 0) {
    scripts.forEach((script) => {
      const scriptElement = document.createElement("script");
      scriptElement.type = "module";
      scriptElement.textContent = script;
      document.head.appendChild(scriptElement);
      document.head.removeChild(scriptElement);
    });
  }
};
