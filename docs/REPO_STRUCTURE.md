# Repo Structure (v14)

`src/game/main.js` er ikke selve spillet — det er kun en note. Runtime bygges fra
`src/game/core/*` + `src/game/data/*` + `src/game/parts/*` til `dist/app.bundle.js`.

## Runtime

```txt
index.html
  loader src/styles/main.css
  loader dist/app.bundle.js   (én IIFE, genereret)
```

## Core (bundlet før parts)

```txt
src/game/core/game-state.js       # GameState scaffold + run-state
src/game/core/math.js             # clamp, lerp, fmtFloorDa
src/game/core/rng.js              # hashStr, mulberry32
src/game/core/save-migrations.js  # scaffold (IKKE bundlet endnu — runtime-migration ligger i parts)
```

Hvilke core-filer der faktisk bundles styres af `coreFiles` i
`tools/build-game-bundle.mjs`. Tilføjer du en ny core-fil, SKAL den tilføjes der,
ellers er den ikke med i spillet (det var præcis sådan math.js/rng.js engang faldt ud).

## Source split (faktiske filnavne — se `src/game/parts/_order.json`)

```txt
src/game/parts/
  01-bootstrap.js                                   # canvas, ctx, W/H/DPR, resize, seed-helpers, error overlay
  02-lyd-webaudio-ingen-filer.js
  03-data-save.js
  04-helte-characters-xp-level-perks-ultimate.js
  05-laboratorie-tidsbaseret-forskning.js
  06-helte-logik-xp-level-perks-specialer.js
  07-laboratorie-logik-tidsbaseret.js
  08-menu-tabs.js
  09-ui-bindings.js
  10-input.js
  11-spil-tilstand.js
  12-verden-resize-sikker-y-gemmes-som-broeker.js
  13-fx-hjaelpere.js
  14-evne.js
  15-ultimate-kun-pve-fair-modes-laast-til-bram.js
  16-sim-fixed-timestep-fair-paa-alle-skaerme.js
  17-run-slut.js
  18-pause.js
  19-duel-links-deling.js
  20-hud.js
  21-loop.js
  22-sprites-erstatter-shadowblur-mobil-fps.js
  23-tegning.js
  24-boot.js
```

Parts deler stadig mange globale runtime-variabler. Rækkefølgen i `_order.json` er
betydningsfuld: `01-bootstrap.js` kører først og definerer canvas/`W`/`H`/`resize`,
som resten af spillet læser.

## Build flow

```txt
src/game/core + data + parts
  -> tools/build-game-bundle.mjs   -> dist/app.bundle.js (+ dist/build-meta.json med source-hash)
  -> tools/build-single-html.mjs   -> dist/graadig-dvaergkast-v14.html
```

`dist/*` er genererede artefakter. Source of truth er `src/`. Rediger aldrig
`dist/` i hånden — kør build-scripts.

## Hvorfor ikke import/export endnu?

Fordi prototypen stadig bruger mange fælles runtime-variabler på tværs af systemer.
Første split er en sikker kilde-split med build step. Næste split flytter state ind
i `GameState` og laver derefter rigtige ES-moduler.

## Næste refactor-plan

1. Saml resterende global state i `GameState` (kun run-scoring er flyttet indtil videre).
2. Flyt data-konstanter til rene data-moduler (`src/game/data/`).
3. Flyt render til funktioner der modtager state.
4. Flyt simulation til renere systems.
5. Først derefter `import/export`.

## Verifikation

```txt
tools/check-repo.mjs            # filer, 24 parts, bygger bundle, node --check, symboler
tools/balance-check.mjs         # systemerne findes
tools/smoke-check.mjs           # bygger bundle + single HTML
tools/save-migration-check.mjs  # save-migrationer
tools/simulate-run.mjs          # KØRER faktisk stepSim headless over 100 seeds (eneste check der eksekverer gameplay)
```
