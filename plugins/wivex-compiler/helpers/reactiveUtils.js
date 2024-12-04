export function createReactiveResolver(stateKeys, propKeys) {
  return (key) => {
    if (stateKeys.includes(key)) return `this.state.${key}`;
    if (propKeys.includes(key)) return `this.props.${key}`;
    return key;
  };
}

export function createGetName(imports) {
  return (word) => {
    const regex = new RegExp(`\\b${word}\\b`, "i");
    const match = imports.match(regex);
    return match ? match[0] : null;
  };
}
