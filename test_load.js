const fs = require('fs');

const code = fs.readFileSync('app.js', 'utf8');

// Mock DOM
global.window = {
  addEventListener: () => {},
};
global.document = {
  getElementById: () => ({ addEventListener: () => {} }),
  querySelectorAll: () => [],
  querySelector: () => null,
  addEventListener: () => {},
};
global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

try {
  eval(code);
  console.log('App loaded without runtime errors during initialization!');
} catch (e) {
  console.error('Runtime error during initialization:', e);
  process.exit(1);
}
