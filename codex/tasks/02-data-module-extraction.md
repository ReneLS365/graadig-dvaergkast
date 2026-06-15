# Task 02: Data module extraction

Flyt statiske data-konstanter fra `src/game/parts/*` til rene moduler i
`src/game/data/`, ét lille slice ad gangen, uden at ændre værdier eller adfærd.

Kandidater: `DATA`, `CAMPAIGN_LEVELS`, `SKILLS`, `WEAPONS`, `CHARACTERS`, `RESEARCH`.

## Status

🟡 I gang. `FAIR_STATS` er flyttet til `src/game/data/fair-stats.js` (PR #11).
Fortsæt med næste lille slice (foreslået: `WEAPONS` eller `CAMPAIGN_LEVELS`).

## Fremgangsmåde (pr. slice)

1. Opret `src/game/data/<navn>.js` med den **identiske** konstant (samme værdier).
2. Fjern den inline-deklaration fra den relevante part.
3. Tilføj filen til `dataFiles` i `tools/build-game-bundle.mjs` (ellers er den ikke i bundlen).
4. Rebuild via build-scripts og verificér.

## Guardrails

- Ingen ændring af tal, balance, økonomi, save-nøgler, UI-flow eller gameplay.
- Flyt ikke flere slices i samme PR — hold dem små og reviewbare.
- Rediger aldrig `dist/` manuelt.

## Accept

- [ ] Mindst ét nyt data-slice flyttet uændret til `src/game/data/`
- [ ] Tilføjet til `dataFiles` i bundleren
- [ ] `npm run check` passerer
- [ ] `npm run balance:check` passerer
- [ ] `npm run smoke` passerer
- [ ] `npm run simulate` passerer (samme outcome-hash som før = ingen gameplayændring)
- [ ] `npm run build` regenererer `dist/`
