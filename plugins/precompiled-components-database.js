const templateStore = {};
const headStore = {};
const styleStore = {};
const stateStore = {};
const beforeMountStore = {};
const afterMountStore = {};

export const setTemplate = (name, template) => (templateStore[name] = template);

export const setHead = (name, head) => (headStore[name] = head);

export const setStyle = (name, style) => (styleStore[name] = style);

export const setState = (name, initialState) => (stateStore[name] = { ...initialState });

export const setBeforeMount = (name, callback) => (beforeMountStore[name] = callback);

export const setAfterMount = (name, callback) => (afterMountStore[name] = callback);

export const getStores = () => {
  return { templateStore, headStore, styleStore, stateStore, beforeMountStore, afterMountStore };
};
