# Data modules

`src/game/data/` is the gradual v14 home for static game data that is currently inline in `src/game/parts/`. Each module keeps its provenance in its own header comment; the list below is generated from the source tree.

<!-- STATUS:DATA-SLICES AUTO START — genereret af tools/status.mjs (npm run status). Rediger ikke i hånden. -->
**Data-module extraction (auto-genereret fra kildekoden):**

- Flyttet til `src/game/data/`: `CAMPAIGN_LEVELS`, `FAIR_STATS`, `SKILLS`, `WEAPONS`, `WEAPON_DROP_POOL`, `WEAPON_ORDER`
- Mangler stadig inline i `src/game/parts/`: `CHARACTERS`, `DATA`, `RESEARCH`
<!-- STATUS:DATA-SLICES AUTO END -->

Move remaining slices in small safe PRs only, and run `npm run status` after each move.
