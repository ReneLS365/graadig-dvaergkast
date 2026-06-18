/*
  Browser-level smoke test (Task 05).

  Loads index.html's generated bundle in a deterministic browser-like VM, clicks the
  real Survival menu button, advances requestAnimationFrame callbacks, and fails on
  uncaught page errors, fatal error overlay creation, missing boot UI, or broken
  bundle loading. This intentionally uses only Node built-ins so the check stays
  lightweight and dependency-free.
*/
import fs from 'node:fs';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';

const INDEX = 'index.html';
const BUNDLE = 'dist/app.bundle.js';
const VIEW_W = 540;
const VIEW_H = 960;
const FRAMES = 240;
const FRAME_MS = 1000 / 60;

execFileSync('node', ['tools/build-game-bundle.mjs'], { stdio: 'inherit' });

if (!fs.existsSync(INDEX)) throw new Error(`Missing ${INDEX}`);
if (!fs.existsSync(BUNDLE)) throw new Error(`Missing ${BUNDLE}`);

const html = fs.readFileSync(INDEX, 'utf8');
const bundle = fs.readFileSync(BUNDLE, 'utf8');
const ids = [...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
const dataModes = [...html.matchAll(/<button[^>]*data-mode="([^"]+)"[^>]*>/g)].map((m) => m[1]);

const errors = [];
let nowMs = 0;
let nextTimerId = 1;
const timers = new Map();
const rafQueue = [];

const noop = () => {};
function fail(message) { throw new Error(message); }
function makeStyle() {
  const style = {
    setProperty(name, value) { style[name] = String(value); },
    getPropertyValue(name) { return style[name] || ''; },
    removeProperty(name) { const old = style[name] || ''; delete style[name]; return old; }
  };
  return new Proxy(style, { get: (t, k) => k in t ? t[k] : '', set: (t, k, v) => { t[k] = String(v); return true; } });
}
function makeClassList(el) {
  const set = new Set();
  return {
    add: (...names) => names.forEach((n) => set.add(n)),
    remove: (...names) => names.forEach((n) => set.delete(n)),
    toggle: (name, force) => { const on = force === undefined ? !set.has(name) : Boolean(force); if (on) set.add(name); else set.delete(name); return on; },
    contains: (name) => set.has(name),
    toString: () => [...set].join(' ')
  };
}
function makeCtx() {
  const grad = { addColorStop: noop };
  return new Proxy({}, {
    get(_t, k) {
      if (k === 'createLinearGradient' || k === 'createRadialGradient' || k === 'createPattern') return () => grad;
      if (k === 'measureText') return (txt = '') => ({ width: String(txt).length * 8 });
      if (k === 'getImageData') return () => ({ data: new Uint8ClampedArray(4) });
      if (k === 'canvas') return { width: VIEW_W, height: VIEW_H };
      return noop;
    },
    set: () => true
  });
}
function makeElement(tagName = 'div', id = '') {
  const listeners = new Map();
  const el = {
    tagName: tagName.toUpperCase(), id, dataset: {}, style: makeStyle(), children: [], parentNode: null,
    textContent: '', innerHTML: '', value: '', checked: false, disabled: false, files: [], width: VIEW_W, height: VIEW_H,
    classList: null,
    addEventListener(type, fn) { if (!listeners.has(type)) listeners.set(type, []); listeners.get(type).push(fn); },
    removeEventListener(type, fn) { const list = listeners.get(type) || []; const i = list.indexOf(fn); if (i >= 0) list.splice(i, 1); },
    dispatchEvent(evt) { evt.target ||= el; for (const fn of listeners.get(evt.type) || []) fn.call(el, evt); const prop = `on${evt.type}`; if (typeof el[prop] === 'function') el[prop].call(el, evt); return true; },
    click() { el.dispatchEvent({ type: 'click', target: el, preventDefault: noop }); },
    appendChild(child) { child.parentNode = el; el.children.push(child); return child; },
    removeChild(child) { el.children = el.children.filter((x) => x !== child); child.parentNode = null; return child; },
    insertBefore(child) { return el.appendChild(child); },
    remove() { if (el.parentNode) el.parentNode.removeChild(el); },
    setAttribute(name, value) { if (name === 'id') elements.set(String(value), el); el[name] = String(value); },
    getAttribute(name) { return el[name] ?? null; },
    getContext: () => makeCtx(),
    getBoundingClientRect: () => ({ width: VIEW_W, height: VIEW_H, left: 0, top: 0, right: VIEW_W, bottom: VIEW_H }),
    focus: noop, blur: noop,
    querySelector: (sel) => document.querySelector(sel),
    querySelectorAll: (sel) => document.querySelectorAll(sel)
  };
  el.classList = makeClassList(el);
  return el;
}

const elements = new Map();
for (const id of ids) elements.set(id, makeElement(id === 'game' ? 'canvas' : 'div', id));
for (const mode of dataModes) {
  const button = makeElement('button');
  button.dataset.mode = mode;
  elements.set(`mode:${mode}`, button);
}

const body = makeElement('body');
const documentElement = makeElement('html');
for (const el of elements.values()) body.appendChild(el);

const document = {
  body, documentElement, hidden: false, visibilityState: 'visible',
  getElementById(id) { return elements.get(id) || null; },
  createElement(tag) { return makeElement(tag); },
  addEventListener: noop, removeEventListener: noop,
  querySelector(sel) { return document.querySelectorAll(sel)[0] || null; },
  querySelectorAll(sel) {
    if (sel === '[data-mode]') return dataModes.map((m) => elements.get(`mode:${m}`));
    if (sel === '.tab') return [];
    if (sel.startsWith('#')) return [elements.get(sel.slice(1))].filter(Boolean);
    return [];
  }
};

function emitWindowError(type, payload) {
  for (const fn of windowListeners.get(type) || []) fn(payload);
}
const windowListeners = new Map();
const localStorage = { _d: {}, getItem(k) { return this._d[k] ?? null; }, setItem(k, v) { this._d[k] = String(v); }, removeItem(k) { delete this._d[k]; }, clear() { this._d = {}; } };
const audioParam = { value: 0, setValueAtTime: noop, linearRampToValueAtTime: noop, exponentialRampToValueAtTime: noop, setTargetAtTime: noop };
const audioNode = new Proxy({}, {
  get(_t, k) {
    if (k === 'gain' || k === 'frequency' || k === 'detune' || k === 'playbackRate') return audioParam;
    if (k === 'getChannelData') return () => new Float32Array(16);
    if (k === 'start' || k === 'stop' || k === 'connect' || k === 'disconnect') return noop;
    return () => audioNode;
  }
});
function AudioCtx() { return new Proxy({ state: 'running', currentTime: 0, sampleRate: 44100, destination: audioNode, resume: noop }, { get: (t, k) => k in t ? t[k] : () => audioNode }); }

const sandbox = {
  console: { log: noop, info: noop, warn: (...a) => errors.push(`console.warn: ${a.join(' ')}`), error: (...a) => errors.push(`console.error: ${a.join(' ')}`) },
  Math, Date, JSON, Object, Array, String, Number, Boolean, RegExp, Error, TypeError, Map, Set, Symbol,
  parseInt, parseFloat, isFinite, isNaN, Float32Array, Uint8Array, Uint8ClampedArray,
  document, localStorage, AudioContext: AudioCtx, webkitAudioContext: AudioCtx, URLSearchParams,
  innerWidth: VIEW_W, innerHeight: VIEW_H, devicePixelRatio: 1,
  performance: { now: () => nowMs },
  location: { search: '', hash: '', protocol: 'file:', href: 'file:///index.html' },
  navigator: { userAgent: 'browser-smoke', vibrate: noop },
  confirm: () => false, alert: noop, prompt: () => '',
  addEventListener(type, fn) { if (!windowListeners.has(type)) windowListeners.set(type, []); windowListeners.get(type).push(fn); },
  removeEventListener: noop,
  requestAnimationFrame(fn) { rafQueue.push(fn); return rafQueue.length; },
  cancelAnimationFrame: noop,
  setTimeout(fn, ms = 0) { const id = nextTimerId++; timers.set(id, { fn, at: nowMs + ms, interval: 0 }); return id; },
  clearTimeout(id) { timers.delete(id); },
  setInterval(fn, ms = 0) { const id = nextTimerId++; timers.set(id, { fn, at: nowMs + ms, interval: ms || 1 }); return id; },
  clearInterval(id) { timers.delete(id); }
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;

function runDueTimers() {
  for (const [id, timer] of [...timers]) {
    if (timer.at > nowMs) continue;
    try { timer.fn(); } catch (err) { errors.push(err.stack || String(err)); emitWindowError('error', { error: err, message: String(err) }); }
    if (timer.interval) timer.at = nowMs + timer.interval;
    else timers.delete(id);
  }
}
function advanceFrame() {
  nowMs += FRAME_MS;
  runDueTimers();
  const callbacks = rafQueue.splice(0, rafQueue.length);
  for (const cb of callbacks) {
    try { cb(nowMs); } catch (err) { errors.push(err.stack || String(err)); emitWindowError('error', { error: err, message: String(err) }); }
  }
}

vm.createContext(sandbox);
try {
  new vm.Script(bundle, { filename: BUNDLE }).runInContext(sandbox);
} catch (err) {
  fail(`Bundle threw during browser smoke boot: ${err.stack || err}`);
}

if (!document.getElementById('game')) fail('Missing #game canvas from index.html fixture.');
if (!document.getElementById('menu')) fail('Missing #menu root UI from index.html fixture.');
if (document.getElementById('fatalErrorOverlay')) fail('#fatalErrorOverlay exists after boot.');

const survivalButton = document.querySelectorAll('[data-mode]').find((b) => b.dataset.mode === 'survival');
if (!survivalButton) fail('Missing Survival start button ([data-mode="survival"]).');
survivalButton.click();

for (let i = 0; i < FRAMES; i++) advanceFrame();

const overlay = document.getElementById('fatalErrorOverlay');
if (overlay && overlay.textContent) fail(`#fatalErrorOverlay was shown: ${overlay.textContent}`);
if (errors.length) fail(`Browser smoke captured page/runtime errors:\n${errors.join('\n')}`);
if (document.getElementById('menu').style.display !== 'none') fail('Survival did not hide the menu after start.');
if (document.getElementById('modeBadge').textContent !== 'Overlevelse') fail('Survival did not update #modeBadge to Overlevelse.');
if (!document.getElementById('subInfo').textContent.includes('Wave 1')) fail('Survival HUD did not show Wave 1 info.');

console.log(`Browser smoke OK. index.html bundle booted Survival for ${FRAMES} frames without fatal overlay or page errors.`);
