import fs from 'node:fs';

const required = [
  'src/game/core/game-state.js',
  'src/game/core/rng.js',
  'src/game/core/save-migrations.js',
  'src/game/parts/16-sim-fixed-timestep-fair-paa-alle-skaerme.js'
];

for (const file of required) {
  if (!fs.existsSync(file)) {
    console.error('Missing simulation dependency:', file);
    process.exit(1);
  }
}

console.log(JSON.stringify({
  ok: true,
  version: 'v14-core-refactor',
  status: 'placeholder',
  next: [
    'Move runtime globals into GameState',
    'Expose deterministic stepSim(state, input)',
    'Run 100 seeded bot simulations',
    'Assert reward/progression bounds'
  ]
}, null, 2));
