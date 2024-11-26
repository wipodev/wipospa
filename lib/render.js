export default function render(component, selector = document.body) {
  component.setContainer(selector);
  selector.appendChild(component.content);
}
