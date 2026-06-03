const fs = require('fs');

let code = fs.readFileSync('app.js', 'utf8');

const start = code.indexOf('function renderGuide()');
const end = code.indexOf('// ── RENDER DE PASOS INDIVIDUALES ─────────────────────────────');

if (start === -1 || end === -1) {
  console.error('Not found renderGuide block');
  process.exit(1);
}

let renderGuideBlock = code.substring(start, end);

// Replace all escaped template literals
renderGuideBlock = renderGuideBlock
  .replace(/\\\${/g, '${')
  .replace(/\\`/g, '`');

code = code.substring(0, start) + renderGuideBlock + code.substring(end);

fs.writeFileSync('app.js', code, 'utf8');
console.log('Fixed escaped template literals in renderGuide!');
