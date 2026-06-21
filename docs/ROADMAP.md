# Roadmap

## Current direction (LOCKED)

GRÅDIG is a single-objective **tower-survival progression roguelite**: you pilot the
mobile **Mine Core guardian** and defend the **Dwarf Core / Mine Core** against escalating
waves while making greedy build choices. The genre is the "tower upgrade / wave survival"
family: defend a central objective, survive escalating waves, draft temporary in-run
upgrades, and grow through bounded permanent progression (workshop, cards, labs, milestones,
difficulty tiers).

This direction is binding. See `docs/TOWER_INSPIRED_DIRECTION.md` and `docs/GAME_DESIGN.md`.

**Genre decision (resolves the open v15 risk):** GRÅDIG does **not** become a new
top-down arena. The existing one-thumb flyer **is** the guardian. The Mine Core is a
persistent run objective with HP; waves advance toward it; you intercept. This reuses the
existing deterministic engine (flight, auto-fire weapons, hazards, gates, seeded sim) and
adds the tower-upgrade meta on top. Lowest risk, ships incrementally.

Do not clone. Do not copy names, UI text, exact layouts, progression, icons, art, or
protected identity from any specific game. Only high-level structure is allowed.

## Definition of "finished" (1.0 scope freeze)

1.0 is shippable when **all** of the following exist, are stable, and pass the verification
gate. Anything not on this list is **out of scope for 1.0** and may only be considered
post-1.0.

1.0 REQUIRES:

- Survival = the Mine Core tower-survival loop (Core HP, wave director, breach/lose).
- In-run upgrade drafts (temporary, run-only).
- Elite waves and boss waves with telegraphed patterns.
- Workshop (bounded permanent upgrades, scrap sink).
- Cards (collectible modifiers, limited active slots).
- Lab/research slots (data sink, slot pressure).
- Milestones and difficulty tiers.
- Campaign as teaching/onboarding (not the main grind).
- Daily Mine + Duel stay fair (standard build).
- Mobile-first polish + PWA (installable, offline, version-update behavior).
- Economy model met and **automatically regression-tested** (see `docs/ECONOMY.md`).

1.0 EXPLICITLY EXCLUDES (post-1.0, may be cut entirely):

- Online leaderboards / duels / accounts / backend (v17). 1.0 ships fully local-first.
- Any system not listed under "1.0 REQUIRES".

## Versions and gates

Each version starts only after the previous version's acceptance doc passes. No version
begins implementation without a design/planning PR first. Every PR runs the full
verification gate (see `docs/V14_RELEASE_PREP.md` or `docs/CODEX_HANDOFF.md`).

### v14 — Core refactor and stability foundation — STABLE

Refactor + stability complete and verified. See `docs/V14_RELEASE_PREP.md` and
`docs/V14_ACCEPTANCE.md`. No further v14 work.

### v15 — Survival becomes the Mine Core tower-survival game

Goal: make Survival the main game and realize the tower-upgrade loop.
Plan and ordered tasks: `docs/V15_PLAN.md`. Exit gate: `docs/V15_ACCEPTANCE.md`.
Execution order is fixed; tasks are pulled one at a time from `codex/CODEX_TASK_QUEUE.md`.

Phases (strict order):
- A: Core loop foundation (Core HP, wave director, lose condition).
- B: In-run depth (upgrade drafts, elites, bosses).
- C: Meta progression (workshop, cards, labs, milestones, difficulty tiers).
- D: Economy lock + acceptance.

### v16 — Polish, mobile UX and PWA

Goal: make the game feel finished on mobile. Layout, touch, onboarding, HUD clarity,
feedback, game-over/reward screen, PWA manifest/icons/offline/version-update.
Starts only after `docs/V15_ACCEPTANCE.md` passes. Needs a v16 planning doc first
(proposed: `docs/V16_PLAN.md`).

### v17 — Online foundation (POST-1.0, optional, may be cut)

Goal: prepare online leaderboard/duel safely **without blocking 1.0**. Server-authoritative
validation, never trust client scores, replay validation design. Implementation requires
explicit approval and a threat-model doc. 1.0 does not depend on this.

### v18 — 1.0 release preparation

Goal: ship 1.0. Versioning, changelog, release checklist, bug triage, performance pass,
save-migration checks, final balance pass, known-issues doc, GitHub release.
Starts only after v16 acceptance and the 1.0 scope freeze are met.

## Technical next step

Status and the next task are maintained in `codex/CODEX_START_HERE.md` and the strict
ordered queue in `codex/CODEX_TASK_QUEUE.md`. v15 implementation may begin only after this
planning PR is merged.
