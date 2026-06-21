# Codex Start Here

Du arbejder i GRÅDIG: Dværgkast Survival+ — v14 stable, v15 i gang (implementering
fra den strikte kø). **Dette dokument er den autoritative kilde til "hvor langt er
vi" og "hvad er næste opgave".** Opdater statustabellen når du afslutter en opgave.

Source of truth: `src/game/core/*` + `src/game/data/*` + `src/game/parts/*`
Browseren loader: `dist/app.bundle.js` (genereret — rediger den aldrig i hånden).

## Kør altid før PR

```bash
npm run check          # filer, 24 parts, bygger bundle, node --check, symboler
npm run balance:check  # systemerne findes
npm run smoke          # bygger bundle + single HTML
npm run smoke:browser  # starter Survival i browser-like VM smoke
npm run simulate       # KØRER spillet headless over 100 seeds (determinisme + ingen NaN)
npm run build          # fuld build (regenererer dist/)
git diff --check       # whitespace/patch hygiene
```

`simulate` er det eneste check der faktisk eksekverer gameplay. Syntaks- og
tekst-checks alene er ikke nok — det var derfor et brudt build kunne overleve
mange "grønne" PR'er. Kører din ændring spillet i stykker, fanger `simulate` det.

## Regler

- Lav små, sikre PR'er. Bevar gameplay, balance, økonomi, save-nøgler og UI-flow,
  medmindre en specifik opgave beder om andet.
- Rebuild altid `dist/` via build-scripts (rediger aldrig genereret output manuelt). Commit ikke `dist/build-meta.json` timestamp-only churn, hvis kun `builtAt` ændrer sig.
- Tilføjer du en ny `src/game/core/`-fil, så husk at tilføje den til `coreFiles` i
  `tools/build-game-bundle.mjs`, ellers kommer den ikke med i bundlen.
- Læs `docs/CODEX_HANDOFF.md` + `docs/TOWER_INSPIRED_DIRECTION.md` før gameplay-arbejde.

## Status (opdater når du afslutter en opgave)

| Opgave | Status | Note |
|---|---|---|
| 00 – Design direction lock | ✅ færdig (PR #3) | docs-only |
| 01 – GameState extraction | ✅ kerne færdig (PR #4–#9) | run-scoring flyttet; bredere global state mangler stadig |
| 02 – Data module extraction | ✅ færdig | planlagte slices flyttet; auto-status viser ingen planlagte inline mål |
| 03 – Save system hardening | ✅ færdig (PR #10) | save:check kører i CI |
| 04 – Headless sim runner | ✅ færdig | `npm run simulate`, kører i CI |
| 05 – Browser smoke test | ✅ færdig | `npm run smoke:browser` kører browser-like VM smoke i CI |
| v15 planning | ✅ færdig (PR #28) | genre låst; ordnet kø + standing rules i `codex/CODEX_TASK_QUEUE.md` |
| V15-01 – Mine Core entity + breach line + lose-on-Core-0 | ✅ færdig (PR #30) | Survival Core HP, breach line og Core-0 lose condition er landet; næste task er HUD-readability |

### Data-slices (auto)

<!-- STATUS:DATA-SLICES AUTO START — genereret af tools/status.mjs (npm run status). Rediger ikke i hånden. -->
**Data-module extraction (auto-genereret fra kildekoden):**

- Flyttet til `src/game/data/`: `CAMPAIGN_LEVELS`, `CHARACTERS`, `CHAR_MAX`, `CHAR_ORDER`, `DATA`, `FAIR_STATS`, `MIN`, `RESEARCH`, `RESEARCH_ORDER`, `SKILLS`, `WEAPONS`, `WEAPON_DROP_POOL`, `WEAPON_ORDER`
- Mangler stadig inline i `src/game/parts/` (planlagte mål): — ingen —
- Utracket inline data i `src/game/parts/` (kun synlighed, ikke planlagt mål): `ACH`, `GATE_COLOR`, `GATE_TIP`
<!-- STATUS:DATA-SLICES AUTO END -->

Kør `npm run status` efter en slice-flytning. `npm run check` fejler hvis blokken
er forældet, eller hvis en fil i `src/game/data/` mangler i `dataFiles`.

## Næste opgave

```txt
V15-02 — Core HP + wave HUD readability
```

v15-planlægningen er **færdig og merget** (PR #28): genre låst (tower-survival på
den eksisterende flyver — flyveren ER Mine Core-vagten), 1.0 scope-freeze, og en
stram, rækkefølge-styret task-plan. Design-kilden er `docs/V15_PLAN.md`, exit-gaten
er `docs/V15_ACCEPTANCE.md`, og økonomi-modellen er `docs/ECONOMY.md`.

v15-implementering fortsætter **kun** fra den strikte kø i
`codex/CODEX_TASK_QUEUE.md`, én task ad gangen, i fast rækkefølge. Den fil er den
autoritative kilde til task-rækkefølge og standing rules: tag næste `TODO`-række
(nu `V15-02`) og følg dens Allowed/Forbidden/Acceptance fra `docs/V15_PLAN.md`.
Spring ikke, slå ikke sammen, og start ikke en senere task før den nuværende er merget.

Læs før gameplay-arbejde: `docs/V15_PLAN.md`, `docs/ECONOMY.md`, `docs/GAME_DESIGN.md`
og `docs/TOWER_INSPIRED_DIRECTION.md`.

Status-noten for data-slices: Task 02 er færdig (auto-status viser ingen planlagte
inline mål tilbage). De utracked inline-symboler `ACH`, `GATE_COLOR` og `GATE_TIP`
er kun synlighed og er ikke planlagte mål, medmindre en senere opgave beslutter det.
