# Codex Start Here

Du arbejder i GRÅDIG: Dværgkast Survival+ v14. **Dette dokument er den autoritative
kilde til "hvor langt er vi" og "hvad er næste opgave".** Opdater statustabellen når
du afslutter en opgave.

Source of truth: `src/game/core/*` + `src/game/data/*` + `src/game/parts/*`
Browseren loader: `dist/app.bundle.js` (genereret — rediger den aldrig i hånden).

## Kør altid før PR

```bash
npm run check          # filer, 24 parts, bygger bundle, node --check, symboler
npm run balance:check  # systemerne findes
npm run smoke          # bygger bundle + single HTML
npm run build          # fuld build (regenererer dist/)
npm run simulate       # KØRER spillet headless over 100 seeds (determinisme + ingen NaN)
```

`simulate` er det eneste check der faktisk eksekverer gameplay. Syntaks- og
tekst-checks alene er ikke nok — det var derfor et brudt build kunne overleve
mange "grønne" PR'er. Kører din ændring spillet i stykker, fanger `simulate` det.

## Regler

- Lav små, sikre PR'er. Bevar gameplay, balance, økonomi, save-nøgler og UI-flow,
  medmindre en specifik opgave beder om andet.
- Rebuild altid `dist/` via build-scripts (rediger aldrig genereret output manuelt).
- Tilføjer du en ny `src/game/core/`-fil, så husk at tilføje den til `coreFiles` i
  `tools/build-game-bundle.mjs`, ellers kommer den ikke med i bundlen.
- Læs `docs/CODEX_HANDOFF.md` + `docs/TOWER_INSPIRED_DIRECTION.md` før gameplay-arbejde.

## Status (opdater når du afslutter en opgave)

| Opgave | Status | Note |
|---|---|---|
| 00 – Design direction lock | ✅ færdig (PR #3) | docs-only |
| 01 – GameState extraction | ✅ kerne færdig (PR #4–#9) | run-scoring flyttet; bredere global state mangler stadig |
| 02 – Data module extraction | 🟡 i gang (PR #11, #13, #14, #15) | `FAIR_STATS`, weapon-metadata, `CAMPAIGN_LEVELS`, `SKILLS` flyttet; mangler `DATA`, `WEAPONS`, `CHARACTERS`, `RESEARCH` |
| 03 – Save system hardening | ✅ færdig (PR #10) | save:check kører i CI |
| 04 – Headless sim runner | ✅ færdig | `npm run simulate`, kører i CI |
| 05 – Browser smoke test | ⬜ ikke startet | |

## Næste opgave

```txt
codex/tasks/02-data-module-extraction.md   (fortsæt — flyt næste lille data-slice)
```

Derefter:

```txt
codex/tasks/05-browser-smoke-test.md
```
