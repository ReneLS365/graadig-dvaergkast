import fs from 'node:fs';
import path from 'node:path';

/*
  Guard against dangling file references in the docs. Markdown that points at a
  repo path which no longer exists is exactly the drift this repo keeps hitting
  (a doc says "see src/game/data/x.js" after x.js was moved).

  To stay trustworthy (a checker that cries wolf gets disabled), we only validate
  inline-code tokens that are unambiguously a concrete repo path:

    - contains a slash and ends in a known source/doc extension
    - first path segment is an actual top-level directory in the repo
    - not a glob, placeholder, or URL

  Lines that explicitly mark a path as an example or proposal (fx, foreslået,
  eksempel, proposed, e.g., ...) are skipped, because planning docs legitimately
  name files that do not exist yet.

    node tools/check-doc-refs.mjs   fail if any doc references a missing file
*/

const DOC_GLOBS = ['README.md', 'docs', 'codex'];
const EXTS = ['js', 'mjs', 'json', 'md', 'css', 'html', 'webmanifest', 'yml', 'yaml'];
const REF_RE = new RegExp('`([^`\\s]+\\.(?:' + EXTS.join('|') + '))`', 'g');
const PROPOSAL_RE = /\b(fx|f\.eks\.|foresl[åa]et|forslag|eksempel|eksempelvis|proposed|example|e\.g\.)\b/i;

const fail = (msg) => { console.error('DOC REFS FAILED:', msg); process.exit(1); };

const ROOT_DIRS = new Set(
  fs.readdirSync('.', { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.git'))
    .map((e) => e.name)
);

function walk(p, acc) {
  if (fs.statSync(p).isDirectory()) {
    for (const e of fs.readdirSync(p)) walk(path.join(p, e), acc);
  } else if (p.endsWith('.md')) {
    acc.push(p);
  }
  return acc;
}

function mdFiles() {
  const acc = [];
  for (const g of DOC_GLOBS) if (fs.existsSync(g)) walk(g, acc);
  return acc;
}

function isConcreteRepoPath(tok) {
  if (!tok.includes('/')) return false;          // bare filenames are too ambiguous
  if (tok.includes('*')) return false;           // glob, e.g. src/game/parts/*
  if (tok.includes('<') || tok.includes('>')) return false; // placeholder, e.g. <navn>.js
  if (tok.includes('://')) return false;         // URL
  return ROOT_DIRS.has(tok.split('/')[0]);       // must start at a real top-level dir
}

const problems = [];
for (const file of mdFiles()) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (PROPOSAL_RE.test(line)) return;          // line names an example/proposal
    for (const m of line.matchAll(REF_RE)) {
      const tok = m[1];
      if (isConcreteRepoPath(tok) && !fs.existsSync(tok)) {
        problems.push(`${file}:${i + 1} references missing path \`${tok}\``);
      }
    }
  });
}

if (problems.length) {
  for (const p of problems) console.error('  -', p);
  fail(`${problems.length} dangling doc reference(s).`);
}
console.log('Doc refs OK. Every concrete file path referenced in the docs exists.');
