export const extractScript = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  let processedTemplate = tempDiv.innerHTML;
  let scriptContent = "";

  const script = tempDiv.querySelector("script");

  if (script) {
    scriptContent = script.textContent;
    script.remove();
    processedTemplate = tempDiv.innerHTML;
  }

  return { processedTemplate, scriptContent };
};
