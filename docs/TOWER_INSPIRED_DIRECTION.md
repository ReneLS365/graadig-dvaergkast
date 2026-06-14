# GRÅDIG Design Direction: Neon Mine Core Survival

## Purpose

This document locks the next design direction before more v14 refactor work continues. It is documentation-only and does not implement gameplay, UI, balance, or dependencies.

GRÅDIG should evolve toward an original neon dwarf/mine wave survival roguelite that uses high-level structural inspiration from tower-survival progression games while keeping GRÅDIG's own identity, fiction, economy, UI tone, and systems language.

## Non-cloning rule

GRÅDIG must not clone, reskin, or closely reproduce any specific tower game.

Do not copy:

- names
- UI text
- exact layouts
- exact progression curves
- exact upgrade trees
- exact icons
- art direction that creates brand confusion
- protected identity, branding, or presentation

Allowed inspiration is limited to broad structure:

- defending a central objective
- surviving escalating waves
- choosing temporary in-run upgrades
- growing through permanent progression
- collecting cards or loadout modifiers
- running parallel research/lab timers or slots
- milestone rewards
- difficulty tiers
- long-term controlled progression
- mobile-first readable interface patterns

## GRÅDIG identity pillars

GRÅDIG remains about dwarves, mines, greed, neon, scrap, gold, data, relics, weapons, heroes, and the Dwarf Core / Mine Core.

The player fantasy should be:

```txt
I defended the Mine Core longer because I made greedy but clever choices.
I lost because the mine got too dangerous, not because progression replaced skill.
I want one more run for enough scrap, data, or relic progress to improve my build.
```

## Core loop target

The long-term survival loop should move toward:

1. Enter the neon mine arena.
2. Defend the Dwarf Core / Mine Core from waves.
3. Collect gold, scrap, data, and relic fragments during the run.
4. Choose temporary in-run upgrades that shape the current build.
5. Survive elites, bosses, hazards, and greed decisions.
6. Bank controlled permanent rewards after defeat or extraction.
7. Spend rewards in workshop, research, cards, heroes, and weapons.
8. Unlock milestones and harder difficulty tiers.
9. Return to the mine with stronger options, not guaranteed victory.

## Structural systems to pursue

### Central arena / Mine Core

Survival should increasingly be framed around protecting or empowering a central Dwarf Core / Mine Core. The core gives GRÅDIG a strong identity hook distinct from generic tower-defense language.

### Wave survival

Waves should remain escalating and readable. Enemy pressure, elite waves, bosses, and hazard events can create run variety without replacing skill.

### In-run upgrades

Runs should include temporary upgrade choices. These should create tactical builds for that run only and should not silently change permanent balance.

### Permanent workshop upgrades

Permanent upgrades should provide long-term goals through workshop-style improvement of weapons, heroes, core systems, and account progression. They must remain controlled so progression does not invalidate player skill.

### Card collection and active slots

Cards should become collectible modifiers with a limited active loadout. The exact names, art, rarity model, and progression must be original to GRÅDIG.

### Lab / research slots

Research should use data and slot-based planning. Slot pressure can create long-term decisions, but implementation must be local-first and avoid manipulative pacing.

### Milestones

Milestones should reward meaningful progress such as wave depth, difficulty clears, boss defeats, relic discoveries, weapon mastery, and Mine Core upgrades.

### Difficulty tiers

Difficulty tiers should let strong players push deeper while keeping early survival accessible. Tiers must be documented before balance values change.

### Controlled long-term progression

Progression may be deep, but rewards must be bounded. Score can explode; account power should not.

### Mobile-first neon UI

Future UI should prioritize one-handed mobile readability, strong contrast, neon mine identity, clear upgrade choices, and fast return-to-run flow.

## Mode implications

### Survival

Survival becomes the main home for the Mine Core loop, temporary upgrades, elites, bosses, milestones, difficulty tiers, cards, workshop upgrades, and research progression.

### Campaign

Campaign should teach systems, provide fixed objectives, and test skill without becoming the primary progression grind.

### Daily Mine

Daily must stay fair. Daily should use a fixed seed and standard build unless a future task explicitly documents a fair alternative.

### Duel

Duel must stay fair. Duel should not depend on owned gear unless a future design explicitly defines separate ranked and progression-enabled variants.

## v14 boundaries

For v14, this direction is a guide for safe refactor work only.

Allowed in v14:

- documentation updates
- GameState extraction
- save/migration hardening
- build/check/smoke tooling improvements
- structure that preserves current gameplay

Out of scope for this documentation PR:

- gameplay implementation
- UI implementation
- dependency changes
- balance value changes
- generated dist changes except those produced by required build scripts

## Implementation sequence after this PR

1. Continue v14 stability and GameState work.
2. Keep runtime behavior stable while moving state into safer modules.
3. Add tests and smoke coverage before content expansion.
4. Start v15 content in small isolated PRs after the refactor foundation is stable.
5. Document each new progression system before implementing balance values.
