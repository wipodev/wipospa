import { updateComponent } from "./reactivityEngine.js";

const templateStore = {};
const headStore = {};
const styleStore = {};
const stateStore = {};
const beforeMountStore = {};
const afterMountStore = {};

export const setTemplate = (name, template) => (templateStore[name] = template);

export const getTemplate = (name) => templateStore[name];

export const getAllTemplates = () => ({ ...templateStore });

export const setHead = (name, head) => (headStore[name] = head);

export const getHead = (name) => headStore[name];

export const setStyle = (name, style) => (styleStore[name] = style);

export const getStyle = (name) => styleStore[name];

export const setState = (name, initialState) => (stateStore[name] = { ...initialState });

export const updateState = (name, newState) => {
  if (stateStore[name]) {
    Object.assign(stateStore[name], newState);
    updateComponent(name);
  } else {
    console.error(`State for component "${name}" not found.`);
  }
};

export const getState = (name) => stateStore[name];

export const setBeforeMount = (name, callback) => (beforeMountStore[name] = callback);

export const getBeforeMount = (name) => beforeMountStore[name];

export const setAfterMount = (name, callback) => (afterMountStore[name] = callback);

export const getAfterMount = (name) => afterMountStore[name];

export const getComponent = (name) => {
  const template = getTemplate(name);
  const head = getHead(name);
  const style = getStyle(name);
  const state = getState(name);
  const beforeMount = getBeforeMount(name);
  const afterMount = getAfterMount(name);
  return { template, head, style, state, beforeMount, afterMount };
};
