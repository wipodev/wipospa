export const headProcessor = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  let templateWithoutHead = tempDiv.innerHTML;
  let headContent = null;

  const customHead = tempDiv.querySelector("wivex\\:head");

  if (customHead) {
    headContent = customHead.innerHTML;
    customHead.remove();
    templateWithoutHead = tempDiv.innerHTML;
  }

  return { templateWithoutHead, headContent };
};
