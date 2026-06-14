# Task 00: Design Direction - Neon Mine Core Survival Loop

## Goal

Create a documentation-only PR that locks GRÅDIG's new design direction before continuing v14 GameState work.

GRÅDIG should evolve toward an original neon dwarf/mine wave survival roguelite inspired only by high-level structural systems from tower-survival progression games.

## In scope

- Create `docs/TOWER_INSPIRED_DIRECTION.md`.
- Update `docs/GAME_DESIGN.md` with the Mine Core survival direction.
- Update `docs/ROADMAP.md` so v14 remains refactor-only and v15 owns content implementation.
- Update `docs/BALANCE.md` with progression guardrails for the new direction.
- Update `docs/CODEX_HANDOFF.md` so future Codex work starts from this direction before GameState extraction.
- Keep all changes documentation-only.

## Out of scope

- Gameplay implementation.
- UI implementation.
- Runtime source changes.
- Dependency changes.
- Balance value changes.
- Manual generated `dist/` edits.

## Design constraints

Do not clone any specific tower game.

Do not copy:

- names
- UI text
- exact layout
- exact progression
- exact icons
- art
- protected identity

Use only high-level structural inspiration:

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

## Required checks

Run before PR:

```bash
npm run check
npm run balance:check
npm run smoke
npm run build
```

## PR notes

The PR must explain:

- the new direction
- files changed
- checks run
- that no gameplay code was intentionally changed
- that implementation starts after this design-direction PR
