import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const fail = (msg) => { console.error('CHECK FAILED:', msg); process.exit(1); };

const required = [
  'index.html',
  'package.json',
  'README.md',
  'src/styles/main.css',
  'src/game/main.js',
  'src/game/parts/_order.json',
  'src/game/core/game-state.js',
  'src/game/core/save-migrations.js',
  'src/game/core/rng.js',
  'src/game/core/math.js',
  'src/pwa/manifest.webmanifest',
  'src/pwa/sw.js',
  'tools/build-game-bundle.mjs',
  'tools/build-single-html.mjs',
  'tools/balance-check.mjs',
  'tools/simulate-run.mjs',
  'docs/CODEX_HANDOFF.md',
  'docs/V14_ACCEPTANCE.md',
  'codex/CODEX_START_HERE.md'
];

for (const file of required) {
  if (!fs.existsSync(file)) fail('Missing ' + file);
}

const order = JSON.parse(fs.readFileSync('src/game/parts/_order.json','utf8'));
if (!Array.isArray(order) || order.length !== 24) fail('Expected 24 game parts.');

for (const file of order) {
  if (!fs.existsSync('src/game/parts/' + file)) fail('Missing part ' + file);
}

execFileSync('node', ['tools/build-game-bundle.mjs'], { stdio: 'inherit' });
execFileSync('node', ['--check', 'dist/app.bundle.js'], { stdio: 'inherit' });

const bundle = fs.readFileSync('dist/app.bundle.js','utf8');
for (const symbol of ['GAME_VERSION', 'SAVE_SCHEMA_VERSION', 'migrateSave', 'STABILITY', 'showFatalErrorOverlay', 'exportSaveData', 'startGame', 'endRun']) {
  if (!bundle.includes(symbol)) fail('Missing symbol in bundle: ' + symbol);
}

console.log('Repo check OK. v14 er Codex-klar.');
