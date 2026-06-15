# Task 05: Browser smoke test

Verificér i en rigtig (eller headless) browser at spillet faktisk starter og kører
uden fatal fejl — ikke bare at det bygger.

Mål: Åbn `index.html`, start Survival, lad spillet køre nogle sekunder, og bekræft
at der ikke dukker en fatal error-overlay op (`#fatalErrorOverlay`).

## Hvorfor

`npm run check`/`smoke` tjekker kun syntaks og tekst — de fanger ikke runtime-fejl i
browseren (DOM, canvas, rendering). `npm run simulate` kører `stepSim` headless uden
rendering. Denne opgave dækker det sidste hul: at render-/UI-laget rent faktisk
overlever i en browser.

## Fremgangsmåde (forslag)

- Tilføj Playwright som devDependency (kun hvis maintainer godkender en ny dependency),
  ELLER brug en let headless DOM (fx en jsdom-baseret `tools/browser-smoke.mjs`) der
  loader bundlen, kalder `startGame('survival', <seed>)`, kører et antal frames og
  asserter at ingen fatal overlay blev sat og at HUD-værdier opdaterer.
- Wire det ind som `npm run smoke:browser` og tilføj det til CI.

## Guardrails

- Ingen gameplay-, balance- eller UI-ændringer — kun test/tooling.
- Hvis du tilføjer en dependency: hold den i `devDependencies` og begrund det i PR'en.

## Accept

- [ ] Et browser/headless-DOM smoke-tjek starter Survival og kører nogle frames
- [ ] Asserter at ingen fatal error-overlay opstår
- [ ] Wired ind i CI
- [ ] Øvrige checks (`check`, `balance:check`, `smoke`, `simulate`, `build`) passerer
