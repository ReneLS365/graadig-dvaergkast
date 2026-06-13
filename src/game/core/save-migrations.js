export const SAVE_SCHEMA_VERSION = 4;

export function migrateSaveObject(input, defaultSave) {
  const save = structuredClone(defaultSave);
  Object.assign(save, input || {});
  save.meta = save.meta || {};
  const from = Number(save.meta.schemaVersion || 1);

  if (from < 2) save.inventory = save.inventory || { scrap: 0, selectedWeapon: 'axe', weapons: { axe: { owned: true, level: 1, xp: 0 } } };
  if (from < 3) save.research = save.research || { points: 0, slots: 1, queue: {}, done: {}, bonuses: {}, weaponCapBonus: 0, passiveGold: 0 };
  if (from < 4) save.characters = save.characters || { roster: { bram: { level: 1, xp: 0 } } };

  save.meta.schemaVersion = SAVE_SCHEMA_VERSION;
  save.meta.migratedAt = Date.now();
  return save;
}
