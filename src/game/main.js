// GRÅDIG v12 source entry
//
// Spillets runtime bygges fra filerne i:
//   src/game/parts/
//
// Brug:
//   npm run build:game
//
// Output:
//   dist/app.bundle.js
//
// index.html loader dist/app.bundle.js, så browseren skal ikke hente 20+ scripts.
// Det er den praktiske mellemvej mellem én kæmpe HTML-fil og fuld ES-module refactor.
// Ja, kompromiser findes. Modbydeligt, men nyttigt.

console.log('GRÅDIG v12: brug npm run build:game eller åbn dist/app.bundle.js via index.html');
