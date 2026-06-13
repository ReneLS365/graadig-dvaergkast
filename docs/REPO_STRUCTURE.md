# Repo Structure v12

`src/game/main.js` er nu ikke længere selve spillet. Den peger på den nye split-struktur.

## Runtime

```txt
index.html
  loader src/styles/main.css
  loader dist/app.bundle.js
```

## Source split

```txt
src/game/parts/
  01-bootstrap.js
  02-audio.js
  03-data-save.js
  04-data-heroes.js
  05-data-research.js
  06-systems-heroes.js
  07-systems-research.js
  08-ui-menu-tabs.js
  09-ui-bindings.js
  10-input.js
  11-state-modes.js
  12-world-generation.js
  13-fx.js
  14-abilities.js
  15-ultimate.js
  16-simulation.js
  17-run-end.js
  18-pause.js
  19-sharing-duels.js
  20-hud.js
  21-loop.js
  22-sprites.js
  23-render.js
  24-boot.js
```

## Build flow

```txt
src/game/parts/* -> tools/build-game-bundle.mjs -> dist/app.bundle.js
```

## Hvorfor ikke import/export endnu?

Fordi prototypen stadig bruger mange fælles runtime-variabler på tværs af systemer. Første split er en sikker kilde-split med build step. Næste split kan flytte state til et `Game` object og derefter lave rigtige ES-moduler.

## Næste refactor-plan

1. Saml al global state i `GameState`.
2. Flyt data-konstanter til rene data-moduler.
3. Flyt render til funktioner der modtager state.
4. Flyt simulation til renere systems.
5. Først derefter `import/export`.


## v13 additions

```txt
tools/check-repo.mjs
tools/clean.mjs
dist/build-meta.json
docs/STABILITY.md
```

`dist/app.bundle.js` er generated artifact. Source of truth er stadig `src/game/parts/*`.
