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

v14 is stable after release-prep verification. Recommended next work: `v15 planning: Mine Core survival loop design`, docs-only. v15 may begin only with a planning/design PR first; do not implement v15 gameplay/content, runtime changes, balance/economy changes, save/data changes, or generated `dist/` changes in that PR.

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

v14 is complete as a refactor and stability foundation. Do not implement cards, labs, workshop systems, Mine Core combat, new bosses, new weapons, runtime changes, save/data changes, or balance changes in the v14 stable documentation PR. The first v15 step must be a docs-only planning/design PR.

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
