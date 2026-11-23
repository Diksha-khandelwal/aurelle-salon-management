// Mock browser environment for Node.js
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

globalThis.localStorage = new LocalStorageMock();
globalThis.window = {
  localStorage: globalThis.localStorage,
  matchMedia: () => ({ matches: false }),
};
globalThis.document = {
  createElement: () => ({}),
};

// Import and run tests
import('./src/utils/guards.ts').then(async guards => {
  console.log('Guards loaded:', Object.keys(guards));
}).catch(err => {
  // Vite tsx or build testing
  console.log('Testing directly via ts module imports...');
});
