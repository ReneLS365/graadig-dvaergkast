# v15 Plan: Mine Core Tower-Survival

Documentation-only plan. This file is the design source of truth for v15. It does not
implement gameplay, UI, balance values, or dependencies. Implementation happens task by
task, in the fixed order below, pulled from `codex/CODEX_TASK_QUEUE.md`.

## 1. Genre resolution (binding)

GRÅDIG stays in the tower-survival / "tower upgrade" genre, realized on the existing flyer
engine. No new top-down arena. No engine rewrite.

- The one-thumb flyer **is** the mobile Mine Core guardian.
- The **Mine Core** is a persistent run objective placed at the left edge of the run
  (behind the guardian's start). It has **Core HP**.
- Waves advance through the tunnel toward the Core. Enemies that cross a **breach line**
  damage the Core instead of (or in addition to) the player.
- A run ends when **Core HP reaches 0** OR the guardian dies. Survival depth = how long the
  Core is held.
- All tower-upgrade systems (in-run drafts, workshop, cards, labs, milestones, difficulty
  tiers) layer onto the existing run/meta loop.

This reuses flight, auto-fire weapons, hazards, gates, the seeded deterministic sim, and the
existing currencies. It is additive and incremental.

## 2. Mode scope

- Survival: the home of the Mine Core loop. All v15 systems land here first.
- Campaign: teaching/onboarding. May reference systems but is not the grind.
- Daily Mine + Duel: stay fair (standard build). No v15 system may give a build advantage in
  these modes. See `docs/GAME_DESIGN.md` fairness rules.

## 3. Invariants that must survive every v15 task

- Determinism: `npm run simulate` (100 seeds) stays green; same seed = same run.
- Fairness: Daily/Duel remain standard-build; competitive leaderboard stays unpolluted.
- Bounded power: score may explode; account/meta power stays bounded (`docs/ECONOMY.md`).
- Generated `dist/` only changes via build scripts; no manual edits; no timestamp-only churn.
- Save safety: additive save keys only, migrated via existing merge/ensure logic; no
  destructive save changes.
- Each balance value change is documented in `docs/ECONOMY.md` or `docs/BALANCE.md` first.

## 4. Ordered tasks

Tasks run strictly in this order. One task = one PR. A task may be split into a `-design`
docs-only sub-PR and a `-impl` PR; the design sub-PR is required whenever the task introduces
new balance values, a new currency flow, or a new system shape. Every PR runs the full
verification gate.

### Phase A — Core loop foundation

**V15-01 — Mine Core entity + lose condition (Survival only)**
- Goal: introduce a persistent Mine Core with HP and a breach line in Survival. Reframe
  existing wave hazards as Core threats: a hazard that crosses the breach line deals Core
  damage and is removed. Run ends on Core HP 0 (in addition to player death).
- Allowed: Survival-mode runtime for Core HP, breach detection, lose condition; minimal Core
  HUD value; additive save key for best Core depth.
- Forbidden: new enemy types; new art beyond a basic Core marker; changes to Campaign/Daily/
  Duel; balance changes to existing rewards; cards/workshop/labs/bosses/drafts.
- Acceptance: Survival can end by Core breach; `simulate` green; determinism intact; other
  modes unchanged; no balance/economy/save-destructive changes.

**V15-02 — Core + wave HUD readability**
- Goal: clear Core HP bar, breach warning, current wave indicator, next-wave telegraph.
- Allowed: HUD/render only, Survival.
- Forbidden: gameplay/balance changes; new systems.
- Acceptance: readable on mobile; no runtime behavior change beyond display; gate green.

**V15-03 — Wave director**
- Goal: explicit wave structure (telegraph → spawn → peak → lull) with a readable wave
  counter, replacing ad-hoc survival spawning. Deterministic from seed.
- Allowed: Survival spawn scheduling; wave model; design sub-PR for wave shape.
- Forbidden: new enemy types; new rewards; difficulty tiers; balance value tuning beyond
  documented wave cadence.
- Acceptance: waves are deterministic and readable; `simulate` green; pacing documented.

### Phase B — In-run depth

**V15-04 — In-run upgrade drafts**
- Goal: at defined wave milestones, offer a choice of 3 **temporary** run-only upgrades from a
  documented pool. No permanent account effect.
- Allowed: draft UI, run-scoped modifiers, documented upgrade pool (`docs/ECONOMY.md` notes
  the run-only guarantee). Design sub-PR required.
- Forbidden: permanent progression effects; cards; workshop; balance changes to base run;
  daily/duel exposure.
- Acceptance: drafts affect only the current run; deterministic given seed+choices; gate
  green; no permanent inflation.

**V15-05 — Elite waves**
- Goal: tougher enemy variants with one telegraphed mechanic each. Survival only.
- Allowed: elite variants, telegraphs, scaled rewards within documented bounds.
- Forbidden: bosses; new currencies; unbounded reward scaling.
- Acceptance: elites readable and fair; `simulate` green; rewards within `docs/ECONOMY.md`.

**V15-06 — Boss waves**
- Goal: a boss every N waves with a defined, telegraphed pattern; defeat = milestone hook +
  bounded reward (relic fragment / scrap).
- Allowed: boss entity, pattern, defeat reward within bounds. Design sub-PR required.
- Forbidden: unbounded rewards; permanent power spikes; daily/duel exposure.
- Acceptance: boss is deterministic, beatable, telegraphed; gate green.

### Phase C — Meta progression (tower upgrades)

**V15-07 — Workshop (permanent, bounded)**
- Goal: permanent upgrades bought with scrap; bounded so they do not trivialize early waves
  or replace skill. Scrap sink.
- Allowed: workshop UI, bounded upgrade tree, scrap spending, additive save keys. Design
  sub-PR with the upgrade table + caps required (`docs/ECONOMY.md`).
- Forbidden: daily/duel advantage; unbounded stacking; moving rewards between currencies.
- Acceptance: caps respected; balance-sim shows skilled profile still needs the documented
  number of runs to complete the tree; fairness intact; gate green.

**V15-08 — Cards (collectible modifiers, limited slots)**
- Goal: original collectible modifiers with a limited active loadout. Original names, rarity,
  art language.
- Allowed: card data (original), collection, active-slot UI, run effects. Design sub-PR with
  rarity model + slot rules required.
- Forbidden: cloning any game's card identity; unlimited active stacking; daily/duel
  advantage.
- Acceptance: active slots bounded; effects deterministic; fairness intact; gate green.

**V15-09 — Lab/research slot expansion**
- Goal: extend the existing research into slot-based planning using data; slot pressure
  creates decisions; local-first, no manipulative pacing.
- Allowed: research slots, data spending, queue UI. Design sub-PR required.
- Forbidden: real-money pacing pressure; daily/duel advantage; data inflation.
- Acceptance: data sink matches `docs/ECONOMY.md`; gate green.

**V15-10 — Milestones**
- Goal: reward meaningful progress (wave depth, boss kills, relic finds, Core upgrades), not
  every tiny action.
- Allowed: milestone tracking + bounded rewards; additive save keys.
- Forbidden: spammy micro-rewards; reward inflation; daily/duel advantage.
- Acceptance: milestones meaningful and bounded; gate green.

**V15-11 — Difficulty tiers**
- Goal: unlockable tiers letting strong players push deeper while baseline survival stays
  accessible. Documented before any value changes.
- Allowed: tier selection, scaled difficulty + bounded reward multipliers per design doc.
- Forbidden: making baseline hostile; unbounded reward scaling; pay-to-win.
- Acceptance: tiers documented and bounded; `simulate` green across tiers.

### Phase D — Economy lock + acceptance

**V15-12 — Economy pass + balance regression check**
- Goal: wire the full economy model and commit an automated balance-regression check that
  asserts the pacing invariants in `docs/ECONOMY.md` (e.g., skilled profile hero-max ≥ target
  runs; nothing maxes everything under the floor).
- Allowed: a committed simulation/check script (e.g., `npm run balance:sim`) + tuning values
  documented in `docs/ECONOMY.md`.
- Forbidden: silent value changes; weakening fairness; removing checks.
- Acceptance: balance check is in CI and green; pacing targets met; gate green.

**V15-13 — v15 acceptance verification**
- Goal: confirm `docs/V15_ACCEPTANCE.md` is fully met; update status docs; remove any stale
  wording; recommend tagging v15.
- Allowed: docs/status only.
- Forbidden: new gameplay; v16 work.
- Acceptance: V15 acceptance checklist all green; no conflicting "v15 unfinished" wording.

## 5. Out of scope for all of v15

- Online/backend/accounts/leaderboards (v17, post-1.0).
- Mobile/PWA polish (v16).
- Any reskin or copy of a specific tower game's identity.
- Any change to Daily/Duel fairness model.
