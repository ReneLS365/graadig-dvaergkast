# Roadmap

## Næste vigtige forbedringer

### 1. Modulær kode

`src/game/main.js` er stadig en stor fil. Den næste rigtige tekniske opgave er at splitte den op:

```txt
src/game/
  core/state.js
  core/save.js
  systems/input.js
  systems/audio.js
  systems/render.js
  systems/collision.js
  data/items.js
  data/heroes.js
```

Det er ikke gjort fuldt endnu, fordi vi ikke skal ødelægge en fungerende prototype bare for at tilfredsstille arkitektur-guderne.

### 2. Rigtig online backend

Supabase-plan:

```txt
players
runs
leaderboards
duels
ghost_replays
inventory_snapshots
```

### 3. Replay validation

Gem seed + input timeline. Server simulerer score. Leaderboards uden replay-validation er bare en invitation til snyd.

### 4. Flere survival-events

- minibosser
- elite waves
- cursed relics
- treasure rooms
- mid-run upgrade valg
- weapon evolution choices
