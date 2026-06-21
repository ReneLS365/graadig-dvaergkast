import assert from 'node:assert/strict';
import { SAVE_SCHEMA_VERSION, migrateSaveObject } from '../src/game/core/save-migrations.js';

const defaultSave = {
  gold: 0,
  xp: 0,
  level: 1,
  best: 0,
  bestDist: 0,
  bestCoreDepth: 0,
  runs: 0,
  wins: 0,
  duelWins: 0,
  name: '',
  sound: true,
  seenIntro: false,
  seenGates: {},
  owned: { pilots: ['bram'], cores: ['oak'], chips: ['tin'], abilities: ['hammer'] },
  levels: { pilots: { bram: 1 }, cores: { oak: 1 }, chips: { tin: 1 }, abilities: { hammer: 1 } },
  selected: { pilot: 'bram', core: 'oak', chip: 'tin', ability: 'hammer' },
  achievements: {},
  skills: {},
  inventory: { scrap: 0, selectedWeapon: 'axe', weapons: { axe: { owned: true, level: 1, xp: 0 } } },
  campaign: { unlocked: 1, current: 1, stars: {} },
  characters: { roster: { bram: { level: 1, xp: 0 } } },
  research: { points: 0, slots: 1, queue: {}, done: {}, bonuses: {}, weaponCapBonus: 0, passiveGold: 0 },
  mission: { date: '', daily: {} },
  meta: { schemaVersion: SAVE_SCHEMA_VERSION, version: 'v14-core-refactor', createdAt: 1, savedAt: 1 },
  dailyRun: { date: '', tries: 0, best: 0 },
  leaderboard: [],
  ghosts2: {}
};

function checkMigratedSave(save) {
  assert.equal(save.meta.schemaVersion, SAVE_SCHEMA_VERSION);
  assert.equal(save.meta.version, 'v14-core-refactor');
  assert.equal(save.inventory.weapons.axe.owned, true);
  assert.equal(save.inventory.selectedWeapon, 'axe');
  assert.equal(save.research.slots, 1);
  assert.deepEqual(save.research.queue, {});
  assert.equal(save.characters.roster.bram.level, 1);
  assert.equal(typeof save.bestCoreDepth, 'number');
}

const v1Save = {
  gold: 1234,
  level: 3,
  meta: { schemaVersion: 1, version: 'old' },
  owned: { pilots: ['bram', 'frida'], cores: ['oak'], chips: ['tin'], abilities: ['hammer'] },
  levels: { pilots: { bram: 2, frida: 1 }, cores: { oak: 1 }, chips: { tin: 1 }, abilities: { hammer: 1 } },
  selected: { pilot: 'frida', core: 'oak', chip: 'tin', ability: 'hammer' }
};
const migratedV1 = migrateSaveObject(v1Save, defaultSave);
checkMigratedSave(migratedV1);
assert.equal(migratedV1.gold, 1234);
assert.equal(migratedV1.selected.pilot, 'frida');

const malformedNestedSave = migrateSaveObject({
  meta: { schemaVersion: 4, version: 'v14-core-refactor' },
  inventory: [],
  research: 'broken',
  characters: { roster: [] },
  leaderboard: 'not-an-array'
}, defaultSave);
checkMigratedSave(malformedNestedSave);
assert.deepEqual(malformedNestedSave.leaderboard, []);

const primitiveSave = migrateSaveObject('not a save', defaultSave);
checkMigratedSave(primitiveSave);
assert.equal(primitiveSave.gold, 0);

const futureSave = migrateSaveObject({
  meta: { schemaVersion: 999, version: 'future' },
  gold: 55,
  inventory: { scrap: 7, selectedWeapon: 'ghost', weapons: { axe: { owned: true, level: 2, xp: 3 } } },
  research: { points: 9, slots: 2, queue: [], done: null, bonuses: { control: 0.1 }, weaponCapBonus: 1, passiveGold: 2 },
  characters: { roster: { bram: { level: 4, xp: 20 } } }
}, defaultSave);
assert.equal(futureSave.meta.schemaVersion, SAVE_SCHEMA_VERSION);
assert.equal(futureSave.gold, 55);
assert.equal(futureSave.inventory.scrap, 7);
assert.equal(futureSave.inventory.selectedWeapon, 'axe');
assert.deepEqual(futureSave.research.queue, {});
assert.deepEqual(futureSave.research.done, {});
assert.equal(futureSave.characters.roster.bram.level, 4);

console.log('Save migration check OK. Old, malformed, primitive, and future-version saves are handled.');
