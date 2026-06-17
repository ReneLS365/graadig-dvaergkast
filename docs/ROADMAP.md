# Roadmap

## Current direction

GRÅDIG skal udvikle sig mod en original neon dwarf/mine wave survival roguelite med Dwarf Core / Mine Core som central fantasy. Retningen er dokumenteret i `docs/TOWER_INSPIRED_DIRECTION.md` og må kun bruge højniveau strukturel inspiration fra tower-survival progression games.

Do not clone. Do not copy names, UI text, exact layouts, progression, icons, art, or protected identity.

## v14: Core refactor and stability foundation

Goal: gøre kodebasen stabil nok til fremtidig modulær udvikling uden at ødelægge den playable build.

### Allowed work

- documentation-only design direction PR
- gradually move runtime state into GameState
- save schema and migration robustness
- build/check/smoke tooling improvements
- prepare data/system/render folders
- preserve existing gameplay
- preserve current dist build behavior
- preserve Termux/browser compatibility

### Out of scope unless explicitly requested

- new weapons
- new heroes
- new bosses
- card implementation
- lab implementation
- workshop implementation
- online features
- leaderboards
- auth/backend
- major UI redesign
- dependency upgrades
- balance changes

## v15: Survival content expansion

Goal: make survival mode feel like the main game.

Planned content directions:

- central arena / Mine Core battle loop
- elite waves
- boss waves
- treasure rooms
- cursed relics
- mid-run upgrade choices
- weapon evolution choices
- workshop permanent upgrades
- card collection and active card slots
- lab/research slots
- milestones
- difficulty tiers

Rules:

- add content in small isolated PRs
- protect campaign/daily/duel modes
- keep daily/duel fair
- update design and balance docs before changing values

## v16: Polish, mobile UX and PWA

Goal: make the game feel finished on mobile.

Planned work:

- mobile layout improvements
- touch control improvements
- tutorial/onboarding
- HUD clarity
- feedback effects
- game over/reward screen
- PWA manifest/icons/offline/version update behavior
- mobile-first neon UI polish

## v17: Online leaderboard/duel foundation

Goal: prepare online leaderboard/duel systems safely.

Supabase planning targets:

```txt
players
runs
leaderboards
duels
ghost_replays
inventory_snapshots
```

Rules:

- do not implement backend without explicit approval
- never trust client-submitted scores
- use replay validation design before public leaderboards
- keep offline/local play working

## v18: Beta release preparation

Goal: prepare a stable beta.

Planned work:

- versioning
- changelog
- release checklist
- bug triage
- performance pass
- save migration checks
- final balance pass
- GitHub release preparation
- known issues document

## Technical next step

Den aktuelle status og næste opgave vedligeholdes i `codex/CODEX_START_HERE.md`.
v14 forbliver refactor/stabilitet — content starter i v15.
