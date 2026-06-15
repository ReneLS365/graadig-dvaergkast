# Task 04: Headless sim runner

Lav deterministic simulation for 100 seeds.

## Status: implementeret

`tools/simulate-run.mjs` (kør med `npm run simulate`) loader den ægte
`dist/app.bundle.js` i en `node:vm`-sandbox med minimale DOM/canvas/audio-stubs
og driver den rigtige `stepSim()` over 100 seeds med en deterministisk
look-ahead-styrings-bot, der dodger hazards. Det er det første tjek i repoet,
der faktisk *eksekverer* gameplay. Botten når mål-linjen i ca. en tredjedel af
runs, så både død- og finish/banking-grenene bliver dækket.

Accept:
- [x] Deterministisk simulation for 100 seeds (verificeret ved gen-kørsel i frisk sandbox)
- [x] Ingen NaN/Infinity i run-økonomien
- [x] Hver seed terminerer (død eller mål) uden at kaste
- [x] Sane bounds (score ≥ 0, distance ≥ 0, peak ≥ 1)
- [x] Wired ind i CI (`.github/workflows/ci.yml`)

## Note

Runneren afslørede at det modulære build manglede hele canvas-/render-bootstrappen
(`$`, `canvas`, `ctx`, `W`, `H`, `resize`, `fmt`, `now`, seed-helpers) samt at
`core/math.js` og `core/rng.js` aldrig blev bundlet. Det er nu rettet — uden den
fik bundlen `ReferenceError` allerede ved boot.
