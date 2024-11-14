import { renderComponent } from "./renderEngine.js";

const componentRegistry = {};
const stateRegistry = {};
const beforeMountRegistry = {};
const afterMountRegistry = {};

export const addComponent = (name, template) => (componentRegistry[name] = template);

export const getComponent = (name) => componentRegistry[name];

export const getAllComponents = () => ({ ...componentRegistry });

export const addState = (name, initialState) =>
  (stateRegistry[name] = {
    ...initialState,
    setState(newState) {
      Object.assign(stateRegistry[name], newState);
      renderComponent(name);
    },
  });

export const getState = (name) => stateRegistry[name];

export const addBeforeMount = (name, callback) => (beforeMountRegistry[name] = callback);

export const getBefroreMount = (name) => beforeMountRegistry[name];

export const addAfterMount = (name, callback) => (afterMountRegistry[name] = callback);

export const getAfterMount = (name) => afterMountRegistry[name];

export default {
  addComponent,
  getComponent,
  getAllComponents,
  addState,
  getState,
  addBeforeMount,
  addAfterMount,
  getBefroreMount,
  getAfterMount,
};
