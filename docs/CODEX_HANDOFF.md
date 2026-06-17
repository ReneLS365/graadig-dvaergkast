# Codex Handoff: v14 Core Refactor

Runtime: `src/game/parts/*` -> `dist/app.bundle.js`

## Where we are / what's next

Status og næste opgave vedligeholdes ét sted: `codex/CODEX_START_HERE.md`.
Start altid med at læse den.

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
npm run simulate   # eneste check der faktisk kører spillet — kør det altid
```
