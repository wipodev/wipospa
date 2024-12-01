import MagicString from "magic-string";

export default function mapTransformations(sourceCode, component, componentName) {
  const magicString = new MagicString(sourceCode);

  let index = generateImportsModifications(magicString, component, componentName);
  generatePropsModifications(magicString, component, index);

  return magicString;
}

function generateImportsModifications(magicString, component, componentName) {
  const original = magicString.original;
  const { imports, indexes } = component.scriptContent;
  let index = 0;

  magicString.remove(0, original.indexOf("<script>") + "<script>".length);

  if (imports) {
    magicString.move(indexes.imports.start, indexes.imports.end, 0);
    index = indexes.imports.end;
  }

  magicString.appendRight(
    index,
    `
    class ${componentName} {
      constructor(props = {}){
        trhis.id = Math.random().toString(36).substring(2, 9);
        this.subscriptions = {};
        this.state = {};`
  );

  return index;
}

function generatePropsModifications(magicString, component, index) {
  const { props, indexes } = component.scriptContent;

  indexes.props.forEach((propIndex) => {
    magicString.remove(propIndex.start, propIndex.end);
  });

  const propsString = props.map(([key, value]) => `${key}: ${value}`).join(", ");

  magicString.appendRight(
    index,
    `
        this.props = { ${propsString}, ...props};
        `
  );
}
