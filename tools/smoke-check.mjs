import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

execFileSync('node', ['tools/check-repo.mjs'], { stdio: 'inherit' });
execFileSync('node', ['tools/build-single-html.mjs'], { stdio: 'inherit' });

if (!fs.existsSync('dist/graadig-dvaergkast-v14.html')) {
  console.error('Missing single HTML build');
  process.exit(1);
}

const single = fs.readFileSync('dist/graadig-dvaergkast-v14.html','utf8');
for (const needle of ['Dværgkast Survival+ v14', 'GAME_VERSION', 'showFatalErrorOverlay', 'migrateSave']) {
  if (!single.includes(needle)) {
    console.error('Single build missing:', needle);
    process.exit(1);
  }
}

console.log('Smoke check passed. v14 bygger og overlever basal virkelighed.');
