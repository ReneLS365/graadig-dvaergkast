# Codex Handoff: v14 Stable

Runtime: `src/game/parts/*` -> `dist/app.bundle.js`

## Where we are / what's next

Status og næste opgave vedligeholdes ét sted: `codex/CODEX_START_HERE.md`.
Start altid med at læse den.

Current status:

- Task 02 planned data module extraction is complete: the auto-generated status block
  reports no planned inline data-slice targets remaining. The visible untracked
  inline symbols (`ACH`, `GATE_COLOR`, `GATE_TIP`) are not planned Task 02 targets
  unless a later task explicitly decides otherwise.
- Task 05 browser smoke test is complete: `npm run smoke:browser` starts Survival
  in a browser-like VM smoke environment and is wired into CI.
- CI runs on Node 24 actions and includes `check`, `balance:check`, `smoke`,
  `smoke:browser`, `build`, and `simulate`.

v14 is stable after release-prep verification, and v15 planning is complete (PR #28). Recommended next work: `V15-01` — implementation proceeds one task at a time from the strict ordered queue in `codex/CODEX_TASK_QUEUE.md`, each task following its Allowed/Forbidden/Acceptance in `docs/V15_PLAN.md`.

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

## v14 stable boundary

v14 is complete as a refactor and stability foundation, and v15 planning is locked (PR #28). v15 implementation proceeds only from the strict ordered queue in `codex/CODEX_TASK_QUEUE.md`, one task at a time, starting with `V15-01`. Stay inside each task's Allowed list in `docs/V15_PLAN.md`; do not batch, reorder, or start a later task before the current one is merged.

Generated `dist/` artifacts must only change through build scripts. Do not commit `dist/build-meta.json` timestamp-only churn when a build only updates `builtAt`.

Required checks before PR:

```bash
npm run check
npm run balance:check
npm run smoke
npm run smoke:browser
npm run simulate   # eneste check der faktisk kører spillet — kør det altid
npm run build
git diff --check
```
