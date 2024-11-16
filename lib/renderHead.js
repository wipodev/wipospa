export const renderHead = (head) => {
  if (!head) return;
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = head;

  Array.from(tempDiv.children).forEach((element) => {
    const tagName = element.tagName.toLowerCase();

    if (tagName === "title") {
      document.title = element.textContent;
    } else if (tagName === "meta") {
      updateMeta(element);
    } else {
      updateHeadElement(element);
    }
  });
};

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
