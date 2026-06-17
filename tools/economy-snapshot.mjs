/*
  Economy golden-master (forberedelse til DATA-slicen, Task 02).

  Hvorfor: en data-slice-extraktion (fx DATA: pilots/cores/chips/abilities) skal
  være VÆRDI-IDENTISK. Men de eksisterende checks beviser ikke det for økonomien:
  `check`/`smoke` er ren tekst, og `simulate` kører kun standard-loadoutet
  (bram + oak + tin + hammer @ Lv1, frisk save). Det rører kun 4 af ~28
  item-definitioner og ingen level-skalering — så en tabt ciffer i fx `thorin`
  eller et gear på Lv10 ville passere alle checks lydløst.

  Dette værktøj loader den ægte bundle i en node:vm-sandbox (samme mønster som
  tools/simulate-run.mjs), eksponerer økonomi-funktionerne via en epilog der KUN
  injiceres under test (aldrig i dist/), og pinner deres output mod en committet
  golden-master.

  Dækket:
   - alle pilots via characterStats() ved Lv 1/5/10/CHAR_MAX (CHAR_MAX fanger alle perks)
   - alle cores/chips/abilities via itemStats() ved Lv 1/5/MAX_GEAR_LEVEL (gear-skalering)
   - fuld buildStats()-summering for udvalgte loadouts (beviser sammensætnings-wiringen)

  Bevidst IKKE dækket (baseline = nul, DEFAULT_SAVE):
   - skills (save.skills = {}) og research-bonusser (save.research.bonuses = {})
   - fair-mode (FAIR_STATS er en separat konstant, uden for DATA-slicens scope)

  Brug:
    node tools/economy-snapshot.mjs --write   skriv/opdatér golden bevidst (tools/economy-golden.json)
    node tools/economy-snapshot.mjs --check    fejl hvis aktuelt output afviger fra golden

  --check kører i `npm run check` (og dermed CI). Når DATA senere extraheres
  uændret, skal --check forblive grøn; ændres et tal bevidst, kør --write og
  commit diffen sammen med ændringen.
*/
import fs from 'node:fs';
import vm from 'node:vm';

const BUNDLE = 'dist/app.bundle.js';
const GOLDEN = 'tools/economy-golden.json';
const VIEW_W = 540;
const VIEW_H = 960;
const PRECISION = 9; // decimaler — neutraliserer float-formatforskelle på tværs af maskiner

const fail = (msg) => { console.error('ECONOMY FAILED:', msg); process.exit(1); };

if (!fs.existsSync(BUNDLE)) {
  fail(`Missing ${BUNDLE} — run \`npm run build:game\` first.`);
}

// Eksponér de in-IIFE funktioner harnessen skal bruge. Injiceres kun her under
// test, ikke i den genererede bundle.
const EPILOGUE = `
;globalThis.__ECON__ = {
  get save(){ return save; }, set save(v){ save = v; },
  buildStats: () => buildStats(),
  characterStats: (k) => characterStats(k),
  itemStats: (t, k) => itemStats(t, k),
  DATA, CHARACTERS, MAX_GEAR_LEVEL, CHAR_MAX, DEFAULT_SAVE
};
`;

const raw = fs.readFileSync(BUNDLE, 'utf8');
const lastClose = raw.lastIndexOf('})();');
if (lastClose === -1) fail('Could not find IIFE close in bundle; cannot inject economy hooks.');
const injected = raw.slice(0, lastClose) + EPILOGUE + raw.slice(lastClose);
const script = new vm.Script(injected, { filename: 'app.bundle.econ.js' });

const noop = () => {};

function makeCtx() {
  const grad = { addColorStop: noop };
  return new Proxy({}, {
    get(_t, k) {
      if (k === 'createLinearGradient' || k === 'createRadialGradient' || k === 'createPattern') return () => grad;
      if (k === 'measureText') return () => ({ width: 8 });
      if (k === 'getImageData') return () => ({ data: [] });
      if (k === 'canvas') return { width: VIEW_W, height: VIEW_H };
      return noop;
    }
  });
}

function makeElement() {
  const style = new Proxy({}, { get: () => '', set: () => true });
  const ctx = makeCtx();
  return {
    style, textContent: '', innerHTML: '', value: '', checked: false,
    width: VIEW_W, height: VIEW_H, files: [], dataset: {},
    classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
    getContext: () => ctx,
    addEventListener: noop, removeEventListener: noop,
    appendChild: (x) => x, removeChild: noop, insertBefore: (x) => x,
    setAttribute: noop, getAttribute: () => null, remove: noop,
    querySelector: () => makeElement(), querySelectorAll: () => [],
    getBoundingClientRect: () => ({ width: VIEW_W, height: VIEW_H, left: 0, top: 0, right: VIEW_W, bottom: VIEW_H }),
    focus: noop, blur: noop, click: noop
  };
}

function makeSandbox() {
  const audioNode = new Proxy({}, {
    get(_t, k) {
      if (k === 'gain' || k === 'frequency' || k === 'detune' || k === 'playbackRate') {
        return { value: 0, setValueAtTime: noop, linearRampToValueAtTime: noop, exponentialRampToValueAtTime: noop, setTargetAtTime: noop };
      }
      if (k === 'getChannelData') return () => new Float32Array(16);
      return () => audioNode;
    }
  });
  const AudioCtx = function () {
    return new Proxy({ state: 'running', currentTime: 0, sampleRate: 44100, destination: audioNode, resume: noop, suspend: noop }, {
      get(t, k) { if (k in t) return t[k]; return () => audioNode; }
    });
  };
  const doc = {
    getElementById: () => makeElement(),
    querySelector: () => makeElement(),
    querySelectorAll: () => [],
    createElement: () => makeElement(),
    addEventListener: noop, removeEventListener: noop,
    body: makeElement(), documentElement: makeElement(),
    hidden: false, visibilityState: 'visible'
  };
  const sandbox = {
    console: { log: noop, warn: noop, error: noop, info: noop },
    Math, Date, JSON, Object, Array, String, Number, Boolean, isNaN, isFinite,
    parseInt, parseFloat, Float32Array, Uint8Array, Map, Set, Symbol, RegExp, Error,
    performance: { now: () => 0 },
    requestAnimationFrame: noop, cancelAnimationFrame: noop,
    setTimeout: () => 0, clearTimeout: noop, setInterval: () => 0, clearInterval: noop,
    innerWidth: VIEW_W, innerHeight: VIEW_H, devicePixelRatio: 1,
    addEventListener: noop, removeEventListener: noop,
    location: { search: '', hash: '', protocol: 'https:', href: 'https://local/' },
    navigator: { userAgent: 'node-econ', vibrate: noop },
    localStorage: { _d: {}, getItem(k) { return k in this._d ? this._d[k] : null; }, setItem(k, v) { this._d[k] = String(v); }, removeItem(k) { delete this._d[k]; }, clear() { this._d = {}; } },
    document: doc,
    AudioContext: AudioCtx, webkitAudioContext: AudioCtx,
    URLSearchParams, confirm: () => false, alert: noop, prompt: () => ''
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  return sandbox;
}

// --- snapshot-bygning -------------------------------------------------------

const norm = (v) => {
  const r = Number(Number(v).toFixed(PRECISION));
  return r === 0 ? 0 : r; // normalisér -0 -> 0
};

// Stabil, nøgle-sorteret repræsentation, så reordering af kilde-data ikke giver
// falske diffs og JSON er identisk på tværs af maskiner.
function stable(obj) {
  if (Array.isArray(obj)) return obj.map(stable);
  if (obj && typeof obj === 'object') {
    const o = {};
    for (const k of Object.keys(obj).sort()) o[k] = stable(obj[k]);
    return o;
  }
  if (typeof obj === 'number') return norm(obj);
  return obj;
}

function buildSnapshot(econ) {
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const setSave = (s) => { econ.save = s; };
  const base = () => clone(econ.DEFAULT_SAVE);

  const CHAR_MAX = econ.CHAR_MAX;
  const MAX_GEAR_LEVEL = econ.MAX_GEAR_LEVEL;
  const pilotLevels = [1, 5, 10, CHAR_MAX];
  const gearLevels = [1, 5, MAX_GEAR_LEVEL];

  // characterStats(pilot) ved varierende helt-level.
  const pilotStats = (key, lvl) => {
    const s = base();
    if (!s.owned.pilots.includes(key)) s.owned.pilots.push(key);
    if (!s.levels.pilots[key]) s.levels.pilots[key] = 1;
    s.characters.roster[key] = { level: lvl, xp: 0 };
    s.selected.pilot = key;
    setSave(s);
    return econ.characterStats(key);
  };

  // itemStats(type, key) ved varierende gear-level.
  const gearStats = (type, key, lvl) => {
    const s = base();
    if (!s.owned[type].includes(key)) s.owned[type].push(key);
    s.levels[type][key] = lvl;
    setSave(s);
    return econ.itemStats(type, key);
  };

  const section = (type, levels, fn) => {
    const out = {};
    for (const key of Object.keys(econ.DATA[type])) {
      out[key] = {};
      for (const lvl of levels) out[key][String(lvl)] = fn(type, key, lvl);
    }
    return out;
  };

  const pilots = {};
  for (const key of Object.keys(econ.CHARACTERS)) {
    pilots[key] = {};
    for (const lvl of pilotLevels) pilots[key][String(lvl)] = pilotStats(key, lvl);
  }

  // Fuld buildStats()-summering for udvalgte loadouts: beviser at slot-bidragene
  // sættes korrekt sammen (ikke kun at hvert slot isoleret er uændret).
  const fullStats = (spec) => {
    const s = base();
    const map = { pilot: 'pilots', core: 'cores', chip: 'chips', ability: 'abilities' };
    for (const slot of Object.keys(map)) {
      const type = map[slot];
      const key = spec[slot];
      if (!s.owned[type].includes(key)) s.owned[type].push(key);
      s.levels[type][key] = spec[`${slot}Lvl`] || 1;
      s.selected[slot] = key;
    }
    s.characters.roster[spec.pilot] = { level: spec.pilotLvl || 1, xp: 0 };
    setSave(s);
    return econ.buildStats();
  };

  // Rå struktur-pin af hele DATA + CHARACTERS verbatim. buildStats() konsumerer
  // IKKE DATA.pilots[].stats (pilot-slottet kører via CHARACTERS) og slet ikke
  // `cost` — men `cost` er rigtig økonomi (upgradeCost/købspriser) og resten er
  // også data en slice-extraktion kan tabe et ciffer i. Så vi pinner det rå
  // kilde-objekt og fanger ENHVER felt-ændring, ikke kun de buildStats-anvendte.
  const raw = { DATA: econ.DATA, CHARACTERS: econ.CHARACTERS };

  const integration = {
    // DEFAULT_SAVE-loadout — samme som simulate kører; anker mod den eksisterende sti.
    default: fullStats({ pilot: 'bram', pilotLvl: 1, core: 'oak', coreLvl: 1, chip: 'tin', chipLvl: 1, ability: 'hammer', abilityLvl: 1 }),
    // Tungt loadout på høje levels — ikke-trivielle værdier gennem hele summeringen.
    heavy: fullStats({ pilot: 'thorin', pilotLvl: CHAR_MAX, core: 'phoenix', coreLvl: MAX_GEAR_LEVEL, chip: 'risk', chipLvl: MAX_GEAR_LEVEL, ability: 'overcharge', abilityLvl: MAX_GEAR_LEVEL }),
  };

  const snapshot = {
    _meta: {
      description: 'Golden-master for buildStats()-økonomien. Pinner pilot/core/chip/ability-bidrag og fuld summering, så en data-slice-extraktion kan bevises værdi-identisk.',
      precisionDecimals: PRECISION,
      pilotLevels,
      gearLevels,
      charMax: CHAR_MAX,
      maxGearLevel: MAX_GEAR_LEVEL,
      covers: [
        'rå struktur-pin af hele DATA + CHARACTERS verbatim (alle felter: stats, cost, name, desc, base, growth, perks, ult, research)',
        'alle pilots via characterStats() (base + growth + unlocked perks) ved pilotLevels',
        'alle cores/chips/abilities via itemStats() (level-skalering) ved gearLevels',
        'fuld buildStats()-summering for loadouts: default, heavy',
      ],
      excludes: [
        'skills (save.skills={}) — baseline nul',
        'research-bonusser (save.research.bonuses={}) — baseline nul',
        'fair-mode / FAIR_STATS — separat konstant, uden for scope',
      ],
      update: 'npm run economy:snapshot',
    },
    raw,
    pilots,
    cores: section('cores', gearLevels, gearStats),
    chips: section('chips', gearLevels, gearStats),
    abilities: section('abilities', gearLevels, gearStats),
    integration,
  };

  return stable(snapshot);
}

function computeSnapshot() {
  const sandbox = makeSandbox();
  vm.createContext(sandbox);
  script.runInContext(sandbox, { filename: 'app.bundle.econ.js' });
  const econ = sandbox.__ECON__;
  if (!econ) fail('Bundle did not expose __ECON__ (boot failed).');
  return buildSnapshot(econ);
}

// --- modes ------------------------------------------------------------------

const serialize = (snap) => JSON.stringify(snap, null, 2) + '\n';

function firstDiff(aStr, bStr) {
  const a = aStr.split('\n');
  const b = bStr.split('\n');
  const out = [];
  const max = Math.max(a.length, b.length);
  for (let i = 0; i < max && out.length < 24; i++) {
    if (a[i] !== b[i]) {
      out.push(`  line ${i + 1}:`);
      out.push(`    golden:  ${a[i] === undefined ? '<none>' : a[i].trim()}`);
      out.push(`    current: ${b[i] === undefined ? '<none>' : b[i].trim()}`);
    }
  }
  return out.join('\n');
}

function main() {
  const mode = process.argv[2] || '--check';
  const current = serialize(computeSnapshot());

  if (mode === '--write') {
    fs.writeFileSync(GOLDEN, current, 'utf8');
    console.log(`Economy golden written to ${GOLDEN}.`);
    return;
  }

  if (mode === '--check') {
    if (!fs.existsSync(GOLDEN)) fail(`Missing ${GOLDEN}. Generér baseline med: npm run economy:snapshot`);
    const golden = fs.readFileSync(GOLDEN, 'utf8');
    if (golden !== current) {
      console.error('ECONOMY FAILED: buildStats()-output afviger fra golden-master.');
      console.error('Hvis ændringen er bevidst: kør `npm run economy:snapshot` og commit diffen.');
      console.error('Hvis den IKKE er bevidst (fx en slice-extraktion): du har ændret en værdi — find fejlen.\n');
      console.error(firstDiff(golden, current));
      process.exit(1);
    }
    console.log('Economy check OK. buildStats() matcher golden-master (pilots/cores/chips/abilities + summering).');
    return;
  }

  fail(`Unknown mode "${mode}". Use --write or --check.`);
}

main();
