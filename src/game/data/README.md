# Data modules

`src/game/data/` is the gradual v14 home for static game data that is currently inline in `src/game/parts/`.

Current extracted slices:

- `fair-stats.js` contains the unchanged readonly fair-mode baseline stats previously declared inline in `src/game/parts/03-data-save.js`.
- `weapon-metadata.js` contains the unchanged weapon display order and weapon drop-pool arrays previously declared inline in `src/game/parts/03-data-save.js`.
- `campaign-levels.js` contains the unchanged campaign level definitions previously declared inline in `src/game/parts/03-data-save.js`.
- `skills.js` contains the unchanged skill upgrade metadata previously declared inline in `src/game/parts/03-data-save.js`.
- `weapons.js` contains the unchanged weapon definitions previously declared inline in `src/game/parts/03-data-save.js`.

Future candidates include DATA, CHARACTERS and RESEARCH, but they should move in small safe PRs only.
