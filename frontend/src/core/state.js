/**
 * Reactive State Management System (Pub/Sub Engine)
 */
export class State {
  constructor(initialState = {}) {
    this._listeners = new Map();
    this._state = new Proxy(initialState, {
      set: (target, key, value) => {
        const oldVal = target[key];
        target[key] = value;
        if (oldVal !== value) this._notify(key, value, oldVal);
        return true;
      },
      get: (target, key) => target[key]
    });
  }

  get data() { return this._state; }

  subscribe(key, callback) {
    if (!this._listeners.has(key)) this._listeners.set(key, new Set());
    this._listeners.get(key).add(callback);
    return () => this._listeners.get(key).delete(callback);
  }

  _notify(key, newVal, oldVal) {
    if (this._listeners.has(key)) {
      this._listeners.get(key).forEach(cb => cb(newVal, oldVal));
    }
    if (this._listeners.has('*')) {
      this._listeners.get('*').forEach(cb => cb(this._state, key, newVal));
    }
  }

  setState(newState) {
    Object.keys(newState).forEach(k => { this._state[k] = newState[k]; });
  }
}

export const globalStore = new State({
  user: JSON.parse(localStorage.getItem('nexus_user') || 'null'),
  token: localStorage.getItem('nexus_token') || null,
  activeProject: null,
  theme: 'dark'
});