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

export function resolvedAnidedKey(content, resolveReactiveKey) {
  const [firstWord, ...rest] = content.trim().split(".");
  const resolvedKey = resolveReactiveKey(firstWord);
  return [resolvedKey, ...rest].join(".");
}

export function resolvedReactiveAttr(content, resolveReactiveKey) {
  const resolvedContent = content.replace(/{(.*?)}/g, (_, attr) => resolvedAnidedKey(attr, resolveReactiveKey));
  if (/^\s*{.*}\s*$/.test(content)) {
    return resolvedContent;
  } else {
    return `\`${content.replace(/{(.*?)}/g, (_, attr) => `\${${resolvedAnidedKey(attr, resolveReactiveKey)}}`)}\``;
  }
}
