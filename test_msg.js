const fs = require('fs');
const code = fs.readFileSync('app.js', 'utf8');

// Mock DOM
global.window = { addEventListener: () => {} };
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
  // Export variables to global scope during eval
  eval(code + '\nglobal.State = State;\nglobal.generateSmartMessage = generateSmartMessage;\nglobal.getActiveStep = getActiveStep;\nglobal.getStepPercentage = getStepPercentage;');
  
  const firstContact = { nombre: "Eli", tipo: "🔥 Caliente" };
  const user = State.userProfile;
  user.enfoque = "belleza";
  user.perfil = "autoridad";
  
  console.log('Testing generateSmartMessage...');
  const msg = generateSmartMessage(user.perfil, user.enfoque, firstContact.tipo, firstContact.nombre);
  console.log('Success, generated msg:', msg);
} catch (e) {
  console.error('Error occurred:', e);
  process.exit(1);
}
