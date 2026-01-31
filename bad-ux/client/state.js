export const state = {
  activeField: null,
  listening: false
};

const listeners = new Set();

export function setState(patch) {
  Object.assign(state, patch);
  for (const listener of listeners) {
    listener(state);
  }
}

export function subscribe(listener) {
  listeners.add(listener);
  listener(state);
  return () => listeners.delete(listener);
}
