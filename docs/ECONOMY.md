# Economy Model

This file is the quantified economy model for GRÅDIG. It turns the principles in
`docs/BALANCE.md` into concrete sources, sinks, and pacing targets, and requires those
targets to be **automatically regression-tested**. Before any numeric value changes, update
this file first, then verify with the balance check and `npm run simulate`.

## Core principle

Score may explode. Account and meta power must stay bounded. Meta-progression is **decoupled
from raw score**: rewards use dampened (sqrt-style) functions with hard per-run caps, so a
huge-score run and an average-score run grant similar progression. Skill stays more important
than owned power.

## Currencies (distinct identities — never silently converted)

| Currency | Identity | Main sources | Main sinks |
|---|---|---|---|
| Gold | Immediate greed/run reward | coins, gate banking, capped run-end bonus | gear (cores/chips/abilities), skills, hero unlocks |
| Scrap | Durable equipment progress | survival kills, weapon crates, crystal drops | weapon upgrades, **workshop** |
| Data | Research/lab planning | crystals (in-run), capped run-end bonus | research, **lab slots** |
| Relics | Rare long-term unlocks | rare crates, **boss kills**, **milestones** | relic-tier upgrades/cards, special unlocks |

## Per-run reward caps (decoupled from score)

Rewards are computed from dampened inputs with hard caps so progression cannot be bought with
a single runaway score. Reference values (tune in this file, then test):

- Hero XP per run: dampened by `sqrt(score)`, hard cap ~340; plus bounded skill terms
  (kills, waves, perfects, distance).
- Account XP per run: dampened by `sqrt(score)`, hard cap ~250.
- Data per run (end-of-run bonus): dampened by `sqrt(score)`, hard cap ~24 (crystals also
  grant data in-run, kept small so it does not compound).

These caps are the lever that keeps "weeks, not minutes" true even for expert players.

## Pacing targets (the contract the balance check enforces)

Measured against run-score profiles (beginner ~80k, average ~800k, strong ~10M, skilled
~150M). Targets:

- First upgrade within reach in the first few runs (~10 minutes).
- One new weapon or clear progress toward it by ~30 minutes.
- After ~2 hours: NOT maxed (no maxed heroes, no maxed multiple weapons, not everything
  unlocked).
- Max one hero: skilled profile **>= ~150 runs** (target band ~150-250); average **>= ~250**.
- Account high levels (50+): long-term flex, **not required** for 1.0 completion.
- Workshop tree complete: skilled profile multi-week (document exact target in V15-07 design).
- Full research/lab tree: gated by data caps + time/slot pressure; multi-week.
- No single currency may let a player max everything below a documented floor.

## Required automated balance check (V15-12)

A committed script (e.g. `npm run balance:sim`) must, in CI:

1. Simulate each run-score profile applying the **same** reward functions the game uses
   (shared code, not a re-implementation, to avoid drift).
2. Assert the pacing targets above as hard invariants, e.g.:
   - skilled profile hero-max run count `>= MIN_HERO_MAX_RUNS`;
   - workshop-tree completion run count `>= MIN_WORKSHOP_RUNS`;
   - no currency completes all of its sinks below its floor;
   - account power growth stays within the bounded curve while score is allowed to explode.
3. Fail the build if any invariant breaks.

This converts the "Things to test manually" section of `docs/BALANCE.md` into a regression
gate so a future "maxed in 3 runs" regression cannot ship green.

## Rules for new systems (workshop, cards, labs, tiers, drafts)

- In-run drafts: run-only. Never permanent account inflation.
- Workshop: bounded caps; visible goals without trivializing early waves; scrap sink only.
- Cards: bounded active slots; original identity; collection is not unlimited stacking.
- Lab slots: data sink + slot pressure; local-first; no manipulative pacing.
- Difficulty tiers: bounded reward multipliers; document before changing values.
- Daily/Duel: never affected by any of the above (standard build).
