export const SAVE_SCHEMA_VERSION = 4;
export const GAME_VERSION = 'v14-core-refactor';

export function isPlainSaveObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

export function cloneSaveObject(value) {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

export function mergeSaveDefaults(defaultValue, savedValue) {
  if (Array.isArray(defaultValue)) return Array.isArray(savedValue) ? savedValue : cloneSaveObject(defaultValue);
  if (isPlainSaveObject(defaultValue)) {
    const source = isPlainSaveObject(savedValue) ? savedValue : {};
    const merged = cloneSaveObject(defaultValue);
    for (const key of Object.keys(source)) {
      merged[key] = key in defaultValue ? mergeSaveDefaults(defaultValue[key], source[key]) : source[key];
    }
    return merged;
  }
  return savedValue === undefined ? defaultValue : savedValue;
}

export function migrateSaveObject(input, defaultSave) {
  const save = mergeSaveDefaults(defaultSave, isPlainSaveObject(input) ? input : {});
  save.meta = isPlainSaveObject(save.meta) ? save.meta : {};
  const from = Number(save.meta.schemaVersion || 1);

  if (from < 2 || !isPlainSaveObject(save.inventory)) {
    save.inventory = { scrap: 0, selectedWeapon: 'axe', weapons: { axe: { owned: true, level: 1, xp: 0 } } };
  }
  if (!isPlainSaveObject(save.inventory.weapons)) save.inventory.weapons = { axe: { owned: true, level: 1, xp: 0 } };
  if (!isPlainSaveObject(save.inventory.weapons.axe)) save.inventory.weapons.axe = { owned: true, level: 1, xp: 0 };
  if (!save.inventory.selectedWeapon || !save.inventory.weapons[save.inventory.selectedWeapon]) save.inventory.selectedWeapon = 'axe';

  if (from < 3 || !isPlainSaveObject(save.research)) {
    save.research = { points: 0, slots: 1, queue: {}, done: {}, bonuses: {}, weaponCapBonus: 0, passiveGold: 0 };
  }
  if (!isPlainSaveObject(save.research.queue)) save.research.queue = {};
  if (!isPlainSaveObject(save.research.done)) save.research.done = {};
  if (!isPlainSaveObject(save.research.bonuses)) save.research.bonuses = {};

  if (from < 4 || !isPlainSaveObject(save.characters)) {
    save.characters = { roster: { bram: { level: 1, xp: 0 } } };
  }
  if (!isPlainSaveObject(save.characters.roster)) save.characters.roster = { bram: { level: 1, xp: 0 } };
  if (!isPlainSaveObject(save.characters.roster.bram)) save.characters.roster.bram = { level: 1, xp: 0 };

  save.meta.schemaVersion = SAVE_SCHEMA_VERSION;
  save.meta.version = GAME_VERSION;
  save.meta.migratedAt = Date.now();
  return save;
}
