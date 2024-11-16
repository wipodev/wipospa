export const scriptProcessor = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  let templateWithoutScript = tempDiv.innerHTML;
  let scriptContent = null;

  const script = tempDiv.querySelector("script");

  if (script) {
    scriptContent = script.textContent;
    script.remove();
    templateWithoutScript = tempDiv.innerHTML;
  }

  return { templateWithoutScript, scriptContent };
};
