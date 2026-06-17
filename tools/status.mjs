import fs from 'node:fs';
import path from 'node:path';

/*
  Status generator for the data-module extraction (Task 02).

  The "how far are we" for data slices is fully derivable from the source tree:
  what already lives in src/game/data/ vs. what is still declared inline in
  src/game/parts/. So we generate it instead of hand-maintaining a list that
  drifts every time a slice PR forgets to update the docs.

    node tools/status.mjs --write   regenerate the AUTO block in the docs
    node tools/status.mjs --check   fail if the block is stale or dataFiles is out of sync

  --check runs in `npm run check` (and therefore CI), so a slice PR that forgets
  the docs, or adds a data file without wiring it into the bundler, fails fast.
*/

const DATA_DIR = 'src/game/data';
const PARTS_DIR = 'src/game/parts';
const BUNDLER = 'tools/build-game-bundle.mjs';

// The planned data-extraction universe (Task 02). Already-extracted names drop
// out of "remaining" automatically because they are no longer inline in parts.
const SLICE_CANDIDATES = ['DATA', 'CAMPAIGN_LEVELS', 'SKILLS', 'WEAPONS', 'CHARACTERS', 'RESEARCH', 'FAIR_STATS'];

// Files whose AUTO block should be kept in sync. Each must contain the marker pair.
const TARGETS = ['codex/CODEX_START_HERE.md'];

const MARK_START = '<!-- STATUS:DATA-SLICES AUTO START — genereret af tools/status.mjs (npm run status). Rediger ikke i hånden. -->';
const MARK_END = '<!-- STATUS:DATA-SLICES AUTO END -->';

const fail = (msg) => { console.error('STATUS FAILED:', msg); process.exit(1); };

const topLevelConsts = (src) =>
  [...src.matchAll(/^\s*(?:const|let|var)\s+([A-Za-z0-9_$]+)\s*=/gm)].map((m) => m[1]);

function dataModuleFiles() {
  if (!fs.existsSync(DATA_DIR)) return [];
  return fs.readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.js'))
    .map((f) => path.posix.join(DATA_DIR, f))
    .sort();
}

function extractedNames() {
  const names = new Set();
  for (const file of dataModuleFiles()) {
    for (const name of topLevelConsts(fs.readFileSync(file, 'utf8'))) names.add(name);
  }
  return names;
}

function remainingInline() {
  if (!fs.existsSync(PARTS_DIR)) return [];
  const parts = fs.readdirSync(PARTS_DIR)
    .filter((f) => f.endsWith('.js'))
    .map((f) => fs.readFileSync(path.join(PARTS_DIR, f), 'utf8'))
    .join('\n');
  return SLICE_CANDIDATES
    .filter((name) => new RegExp(`^\\s*(?:const|let|var)\\s+${name}\\s*=`, 'm').test(parts))
    .sort();
}

function bundlerDataFiles() {
  const src = fs.readFileSync(BUNDLER, 'utf8');
  const block = src.match(/const\s+dataFiles\s*=\s*\[([\s\S]*?)\]/);
  if (!block) fail(`Could not find the dataFiles array in ${BUNDLER}.`);
  return [...block[1].matchAll(/['"]([^'"]+)['"]/g)].map((m) => m[1]).sort();
}

function model() {
  const extracted = [...extractedNames()].sort();
  const remaining = remainingInline();
  const onDisk = dataModuleFiles();
  const listed = bundlerDataFiles();
  const missingFromBundler = onDisk.filter((f) => !listed.includes(f)); // exists but not bundled = silent runtime bug
  const missingOnDisk = listed.filter((f) => !onDisk.includes(f));       // listed but absent = build fails
  return { extracted, remaining, missingFromBundler, missingOnDisk };
}

const fmtList = (xs) => (xs.length ? xs.map((x) => `\`${x}\``).join(', ') : '— ingen —');

function renderBlock(m) {
  return [
    MARK_START,
    '**Data-module extraction (auto-genereret fra kildekoden):**',
    '',
    `- Flyttet til \`${DATA_DIR}/\`: ${fmtList(m.extracted)}`,
    `- Mangler stadig inline i \`${PARTS_DIR}/\`: ${fmtList(m.remaining)}`,
    MARK_END
  ].join('\n');
}

function replaceBlock(filePath, block) {
  const src = fs.readFileSync(filePath, 'utf8');
  const start = src.indexOf(MARK_START);
  const end = src.indexOf(MARK_END);
  if (start === -1 || end === -1 || end < start) {
    fail(`Missing STATUS:DATA-SLICES markers in ${filePath}. Add the marker pair where the block should live.`);
  }
  const before = src.slice(0, start);
  const after = src.slice(end + MARK_END.length);
  return { src, next: before + block + after };
}

function checkDataFilesSync(m) {
  const problems = [];
  for (const f of m.missingFromBundler) {
    problems.push(`${f} exists but is not in dataFiles in ${BUNDLER} — it will NOT be bundled (runtime ReferenceError waiting to happen).`);
  }
  for (const f of m.missingOnDisk) {
    problems.push(`${f} is listed in dataFiles in ${BUNDLER} but does not exist on disk.`);
  }
  return problems;
}

function main() {
  const mode = process.argv[2] || '--write';
  const m = model();
  const block = renderBlock(m);
  const syncProblems = checkDataFilesSync(m);

  if (mode === '--check') {
    let stale = false;
    for (const file of TARGETS) {
      const { src, next } = replaceBlock(file, block);
      if (src !== next) {
        stale = true;
        console.error(`Stale status block in ${file}. Run: npm run status`);
      }
    }
    if (syncProblems.length) {
      for (const p of syncProblems) console.error('dataFiles desync:', p);
    }
    if (stale || syncProblems.length) process.exit(1);
    console.log('Status check OK. Data-slice status matches the source tree and dataFiles is in sync.');
    return;
  }

  if (mode === '--write') {
    if (syncProblems.length) {
      for (const p of syncProblems) console.error('WARNING (dataFiles desync):', p);
    }
    let changed = 0;
    for (const file of TARGETS) {
      const { src, next } = replaceBlock(file, block);
      if (src !== next) { fs.writeFileSync(file, next); changed++; console.log('Updated', file); }
    }
    console.log(changed ? `Status written (${changed} file(s)).` : 'Status already up to date.');
    return;
  }

  fail(`Unknown mode "${mode}". Use --write or --check.`);
}

main();
