import fs from 'node:fs';

for (const p of ['dist/app.bundle.js', 'dist/graadig-dvaergkast-v14.html', 'dist/build-meta.json']) {
  if (fs.existsSync(p)) fs.rmSync(p);
}
console.log('Cleaned generated files.');
