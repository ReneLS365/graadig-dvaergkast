# Codex Handoff: v14 Core Refactor

Runtime: `src/game/parts/*` -> `dist/app.bundle.js`

## Current required first step

The design-direction documentation PR is Task 00:

```txt
codex/tasks/00-design-direction-tower-loop.md
```

After Task 00 is reviewed and merged, continue with:

```txt
codex/tasks/01-game-state-extraction.md
```

## Locked design direction

GRÅDIG should evolve toward an original neon dwarf/mine wave survival roguelite centered on defending and improving the Dwarf Core / Mine Core.

Use only high-level structural inspiration from tower-survival progression games:

- central arena / Mine Core
- wave-based survival
- in-run upgrades
- permanent workshop upgrades
- card collection and active card slots
- lab/research slots
- milestones
- difficulty tiers
- controlled long-term progression
- mobile-first neon UI

Do not clone or copy names, UI text, exact layout, progression, icons, art, or protected identity from any specific game.

Preserve GRÅDIG identity:

- dwarves
- mines
- greed
- neon
- scrap
- gold
- data
- relics
- weapons
- heroes
- Dwarf Core / Mine Core

See `docs/TOWER_INSPIRED_DIRECTION.md` and `docs/GAME_DESIGN.md` before starting new gameplay work.

## v14 implementation boundary

v14 remains a refactor and stability phase. Do not implement cards, labs, workshop systems, Mine Core combat, new bosses, new weapons, or balance changes unless a specific future task requests it.

Required checks before PR:

```bash
npm run check
npm run balance:check
npm run smoke
npm run build
```
