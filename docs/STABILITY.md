# Stability Notes

## v13 mål

v13 er ikke en feature-version. Det er en stabilitetsversion.

## Runtime error overlay

Fejl i browseren vises som overlay, så man ikke skal åbne DevTools på mobil for at se hvad der gik galt.

## Save eksport/import

Spillet bruger localStorage. Det er fint til prototype, men sårbart.

Derfor:

- eksportér save før store balanceændringer
- importér save efter test
- reset kun når du vil starte helt rent

## Build checks

`npm run check` gør følgende:

- tjekker nødvendige filer
- tjekker at alle 24 game parts findes
- bygger `dist/app.bundle.js`
- kører `node --check` (kun syntaks)
- tjekker vigtige symboler (kun tekst-tilstedeværelse)

## Source hash

`dist/build-meta.json` indeholder hash over source-parts. Det gør det nemmere at se om bundle faktisk matcher kildekoden.

## Vigtigt: checks der kun læser tekst er ikke nok

`check`/`smoke` kører `node --check` (syntaks) og tjekker at visse symboler findes
som tekst i bundlen. De *eksekverer ikke* spillet. Det er grunden til at et brudt
build (manglende canvas/`W`/`H`/`resize`-bootstrap + ubundlet math/rng) kunne
overleve mange grønne PR'er. Lære: en ændring er ikke verificeret før spillet er kørt.

## Headless simulation (kører faktisk gameplay)

`npm run simulate` (`tools/simulate-run.mjs`) loader den ægte bundle i en vm-sandbox
med DOM/canvas-stubs og driver `stepSim()` deterministisk over 100 seeds. Det fanger
runtime-fejl, NaN-økonomi og non-determinisme. Kører i CI.

## Economy golden master (kører faktisk buildStats)

`npm run economy:check` (`tools/economy-snapshot.mjs`) loader den ægte bundle i en
vm-sandbox og pinner spil-økonomien mod en committet golden-master,
`tools/economy-golden.json`. Det lukker et hul i `simulate`: simulatoren kører kun
standard-loadoutet (bram + oak + tin + hammer @ Lv1, frisk save), så den rører kun
4 af ~28 item-definitioner og ingen level-skalering. En tabt ciffer i fx `thorin`
eller et gear på Lv10 ville ellers passere alle checks lydløst.

Golden-master pinner:

- hele `DATA` + `CHARACTERS` rå (alle felter: stats, cost, name, desc, base, growth, perks, ult, research)
- alle pilots via `characterStats()` ved Lv 1/5/10/30 (fanger alle perks)
- alle cores/chips/abilities via `itemStats()` ved Lv 1/5/10 (level-skalering)
- fuld `buildStats()`-summering for udvalgte loadouts (default + heavy)

Bevidst ikke dækket (baseline nul): skills, research-bonusser og fair-mode
(`FAIR_STATS`). Ændrer du økonomi-tal **bevidst**, kør `npm run economy:snapshot`
og commit diffen sammen med ændringen. `economy:check` kører i `npm run check` (og
dermed CI). Formålet er at en data-slice-extraktion (fx `DATA`) kan bevises
værdi-identisk.

## Næste stabilitetsopgaver

- browser/headless-DOM smoke test (Task 05) — fang fejl i render-/UI-laget
- replay validation senere med server
- auto-save migration versionering

## v14 save migration hardening

Save schema version `4` remains on the existing `graadig_dvaerg_v3` localStorage key for old-save compatibility.

The migration path now defensively rebuilds required save containers when imported or stored JSON has malformed nested values, including inventory, research queues, character roster data, and array fields such as leaderboard data. Invalid imported JSON and non-object imports are rejected instead of replacing the current save with defaults.

`npm run check` includes `npm run save:check`, which covers old schema migration, malformed nested data, primitive/non-object data, and future-version normalization.
