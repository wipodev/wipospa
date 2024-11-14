export const updateHeadContent = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  const customHead = tempDiv.querySelector("wiview\\:head");

  if (customHead) {
    Array.from(customHead.children).forEach((element) => {
      const tagName = element.tagName.toLowerCase();

      if (tagName === "title") {
        updateTitle(element);
      } else if (tagName === "meta") {
        updateMeta(element);
      } else {
        updateHeadElement(element);
      }
    });

    customHead.remove();
  }

  return tempDiv.innerHTML;
};

function updateTitle(element) {
  document.title = element.textContent;
}

function updateMeta(element) {
  const existingMeta = document.querySelector(`meta[name="${element.getAttribute("name")}"]`);
  if (existingMeta) {
    existingMeta.setAttribute("content", element.getAttribute("content"));
  } else {
    document.head.appendChild(element);
  }
}

function updateHeadElement(element) {
  const existingElement = document.head.querySelector(element.tagName.toLowerCase());
  if (existingElement) {
    existingElement.replaceWith(element);
  } else {
    document.head.appendChild(element);
  }
}
