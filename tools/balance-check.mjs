import fs from 'node:fs';

const files = [
  'src/game/parts/03-data-save.js',
  'src/game/parts/05-laboratorie-tidsbaseret-forskning.js',
  'src/game/parts/08-menu-tabs.js',
  'src/game/parts/16-sim-fixed-timestep-fair-paa-alle-skaerme.js'
];

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.error('Missing balance dependency:', file);
    process.exit(1);
  }
}

const source = files.map(f => fs.readFileSync(f, 'utf8')).join('\n');
const checks = [
  ['save schema', 'SAVE_SCHEMA_VERSION'],
  ['migration', 'function migrateSave'],
  ['survival wave', 'survivalWave'],
  ['weapon upgrades', 'weaponUpgradeCost'],
  ['research', 'research']
];

for (const [name, needle] of checks) {
  if (!source.includes(needle)) {
    console.error('Balance check failed:', name);
    process.exit(1);
  }
}

console.log('Balance check OK. Systemerne findes.');
