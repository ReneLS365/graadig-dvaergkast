import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

execFileSync('node', ['tools/build-game-bundle.mjs'], { stdio: 'inherit' });

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('src/styles/main.css', 'utf8');
const js = fs.readFileSync('dist/app.bundle.js', 'utf8');

let out = html
  .replace('<link rel="manifest" href="./src/pwa/manifest.webmanifest">\n', '')
  .replace('<link rel="stylesheet" href="./src/styles/main.css">', `<style>\n${css}\n</style>`)
  .replace('<script src="./dist/app.bundle.js"></script>', `<script>\n${js}\n</script>`);

fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/graadig-dvaergkast-v14.html', out, 'utf8');
console.log('Built dist/graadig-dvaergkast-v14.html');
