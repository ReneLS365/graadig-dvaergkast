# Refactor Plan

## Status v12

Koden er fysisk splittet, men runtime kører stadig som én IIFE bundle. Det er med vilje.

## Hvorfor?

Det bevarer spillet mens vi får struktur. Næste trin kan gøres uden at rode i 130 KB på én gang.

## Foreslået næste split

### Phase 1: State object

Lav:

```js
const Game = {
  save,
  state,
  world,
  player,
  run,
  ui
}
```

Målet er at stoppe spredte globale variabler.

### Phase 2: Pure data modules

Flyt disse til rene moduler:

```txt
data/items.js
data/heroes.js
data/research.js
data/campaign.js
data/skills.js
```

### Phase 3: Systems

```txt
systems/audio.js
systems/input.js
systems/save.js
systems/world.js
systems/simulation.js
systems/combat.js
systems/rewards.js
```

### Phase 4: Renderer

```txt
render/background.js
render/world.js
render/entities.js
render/ui-fx.js
```

### Phase 5: Online backend

Når client-koden er nogenlunde ren:

```txt
Supabase auth
runs table
leaderboards table
duels table
replay validation
```
