/*
  Headless deterministic simulation runner (Task 04).

  Loads the REAL game bundle (dist/app.bundle.js) inside a node:vm sandbox with
  minimal DOM/canvas/audio stubs, then drives the actual stepSim() over 100 seeds
  with a deterministic steering bot. This is the first check in the repo that
  truly *executes* gameplay, so it catches runtime breakage (missing globals,
  ReferenceErrors, NaN economy) that the build/smoke text checks cannot.

  Assertions:
   - The bundle boots and exposes the simulation (no ReferenceError).
   - Every seed runs and terminates (death or finish) without throwing.
   - No NaN/Infinity leaks into the run economy.
   - Sane bounds (score >= 0, distance >= 0, peak >= 1).
   - Determinism: re-running a seed in a fresh sandbox yields identical results.
*/
import fs from 'node:fs';
import vm from 'node:vm';

const BUNDLE = 'dist/app.bundle.js';
const SEEDS = 100;
const MAX_TICKS = 20000;
const VIEW_W = 540;
const VIEW_H = 960;

if (!fs.existsSync(BUNDLE)) {
  console.error('Missing', BUNDLE, '- run `npm run build:game` first.');
  process.exit(1);
}

// Expose the in-IIFE internals the harness needs to drive a run.
const EPILOGUE = `
;globalThis.__SIM__ = {
  get state(){ return state; }, set state(v){ state = v; },
  get gameState(){ return gameState; },
  get dwarf(){ return dwarf; },
  get camX(){ return camX; },
  startGame: (m, s) => startGame(m, s),
  stepSim: () => stepSim(),
  setInput: (v) => { inputDown = v; },
  sampleTrack: (x) => sampleTrack(x)
};
`;

const raw = fs.readFileSync(BUNDLE, 'utf8');
const lastClose = raw.lastIndexOf('})();');
if (lastClose === -1) {
  console.error('Could not find IIFE close in bundle; cannot inject sim hooks.');
  process.exit(1);
}
const injected = raw.slice(0, lastClose) + EPILOGUE + raw.slice(lastClose);
const script = new vm.Script(injected, { filename: 'app.bundle.sim.js' });

const noop = () => {};

function makeCtx() {
  const grad = { addColorStop: noop };
  const ctx = new Proxy({}, {
    get(_t, k) {
      if (k === 'createLinearGradient' || k === 'createRadialGradient' || k === 'createPattern') return () => grad;
      if (k === 'measureText') return () => ({ width: 8 });
      if (k === 'getImageData') return () => ({ data: [] });
      if (k === 'canvas') return { width: VIEW_W, height: VIEW_H };
      return noop;
    }
  });
  return ctx;
}

function makeElement() {
  const style = new Proxy({}, { get: () => '', set: () => true });
  const ctx = makeCtx();
  const el = {
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
  return el;
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
    navigator: { userAgent: 'node-sim', vibrate: noop },
    localStorage: { _d: {}, getItem(k) { return k in this._d ? this._d[k] : null; }, setItem(k, v) { this._d[k] = String(v); }, removeItem(k) { delete this._d[k]; }, clear() { this._d = {}; } },
    document: doc,
    AudioContext: AudioCtx, webkitAudioContext: AudioCtx,
    URLSearchParams, confirm: () => false, alert: noop, prompt: () => ''
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  return sandbox;
}

// mulberry32 mirror — used to force deterministic Math.random per seed.
function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ t >>> 15, 1 | t);
    r ^= r + Math.imul(r ^ r >>> 7, 61 | r);
    return ((r ^ r >>> 14) >>> 0) / 4294967296;
  };
}

function runSeed(seed) {
  const sandbox = makeSandbox();
  vm.createContext(sandbox);
  script.runInContext(sandbox, { filename: 'app.bundle.sim.js' });
  const sim = sandbox.__SIM__;
  if (!sim) throw new Error('Bundle did not expose __SIM__ (boot failed).');

  // Force deterministic stochastic events inside stepSim for this seed.
  sandbox.Math.random = mulberry32(0xA5A5 ^ seed);

  sim.startGame('random', seed >>> 0);

  let ticks = 0;
  while (sim.state === 'play' && ticks < MAX_TICKS) {
    const d = sim.dwarf;
    const wx = sim.camX + d.sx;
    const mid = sim.sampleTrack(wx).mid;
    sim.setInput(d.y > mid); // below the tunnel centre -> hold to rise
    sim.stepSim();
    ticks++;
  }

  const run = sim.gameState.run;
  return {
    seed,
    ticks,
    ended: sim.state !== 'play',
    state: sim.state,
    score: Math.round(run.score),
    banked: Math.round(run.banked),
    livePot: Math.round(run.livePot),
    distance: Math.round(run.distance),
    peak: Number(run.peak.toFixed(4)),
    skips: run.skips,
    survived: run.survived
  };
}

const finite = (n) => typeof n === 'number' && Number.isFinite(n);
const fail = (msg) => { console.error('SIMULATE FAILED:', msg); process.exit(1); };

const results = [];
let reachedFinish = 0;
let died = 0;

for (let seed = 0; seed < SEEDS; seed++) {
  let r;
  try {
    r = runSeed(seed);
  } catch (e) {
    fail(`seed ${seed} threw: ${e && e.stack ? e.stack : e}`);
  }
  // Invariants
  for (const key of ['score', 'banked', 'livePot', 'distance', 'peak']) {
    if (!finite(r[key])) fail(`seed ${seed}: ${key} is not finite (${r[key]})`);
  }
  if (r.score < 0) fail(`seed ${seed}: negative score ${r.score}`);
  if (r.distance < 0) fail(`seed ${seed}: negative distance ${r.distance}`);
  if (r.peak < 1) fail(`seed ${seed}: peak below 1 (${r.peak})`);
  if (!r.ended) fail(`seed ${seed}: run never terminated within ${MAX_TICKS} ticks`);
  if (r.survived) reachedFinish++; else died++;
  results.push(r);
}

// Determinism: re-run a sample of seeds in fresh sandboxes and require identity.
const sample = [0, 7, 23, 42, 99];
for (const seed of sample) {
  const a = JSON.stringify(results[seed]);
  const b = JSON.stringify(runSeed(seed));
  if (a !== b) fail(`seed ${seed} is non-deterministic:\n  run1 ${a}\n  run2 ${b}`);
}

// Aggregate digest — a fingerprint of all 100 outcomes for quick eyeballing.
const digest = results
  .map((r) => `${r.seed}:${r.score}:${r.banked}:${r.distance}:${r.peak}:${r.skips}:${r.survived ? 1 : 0}`)
  .join('|');
let hash = 2166136261 >>> 0;
for (let i = 0; i < digest.length; i++) { hash ^= digest.charCodeAt(i); hash = Math.imul(hash, 16777619); }
const digestHash = (hash >>> 0).toString(16).padStart(8, '0');

const totalScore = results.reduce((s, r) => s + r.score, 0);
console.log(`Simulated ${SEEDS} seeds headlessly (deterministic).`);
console.log(`  reached finish: ${reachedFinish} · died: ${died}`);
console.log(`  median ticks:   ${results.map((r) => r.ticks).sort((a, b) => a - b)[Math.floor(SEEDS / 2)]}`);
console.log(`  avg score:      ${Math.round(totalScore / SEEDS)}`);
console.log(`  outcome hash:   ${digestHash}`);
console.log('Simulate check OK. stepSim er deterministisk og fri for NaN over 100 seeds.');
