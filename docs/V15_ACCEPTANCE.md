# v15 Acceptance Criteria (Definition of Done)

v15 is done only when every item below is true and the full verification gate passes locally
and in CI. Until then v15 stays in progress and the smallest documented blocker is fixed
before tagging. This mirrors the v14 acceptance discipline.


## Current progress

- V15-01 is complete in PR #30: the Mine Core entity, breach line, and Survival lose-on-Core-0 foundation have landed.
- V15-02 is complete: Survival now has readable Core HP, breach state, current wave, and existing distance-derived next-wave progress HUD.
- The next required queue item is `V15-03 — Wave director`.

## Functional

- [x] Survival runs on the Mine Core loop: persistent Core HP, breach line, and a run can end
      by Core breach as well as by guardian death (V15-01, V15-02).
- [ ] Wave director produces deterministic, readable, telegraphed waves (V15-03).
- [ ] In-run upgrade drafts offer run-only temporary upgrades with no permanent account
      effect (V15-04).
- [ ] Elite waves and boss waves exist with telegraphed patterns and bounded rewards
      (V15-05, V15-06).
- [ ] Workshop provides bounded permanent upgrades as a scrap sink (V15-07).
- [ ] Cards are original collectible modifiers with a bounded active loadout (V15-08).
- [ ] Lab/research slots create planning pressure using data, local-first (V15-09).
- [ ] Milestones reward meaningful progress only (V15-10).
- [ ] Difficulty tiers let strong players push deeper without making baseline hostile
      (V15-11).

## Fairness and safety

- [ ] Daily Mine and Duel still use a fixed seed and standard build; no v15 system gives a
      build advantage in these modes.
- [ ] Campaign remains teaching/onboarding, not the primary grind.
- [ ] Determinism holds: `npm run simulate` is green; same seed = same run across all new
      systems.
- [ ] Save changes are additive and migrate cleanly; no destructive save changes.
- [ ] No silent movement of rewards between currencies; currency identities preserved.

## Economy

- [ ] The economy model in `docs/ECONOMY.md` is implemented.
- [ ] An automated balance-regression check is committed and green in CI (V15-12), asserting:
  - [ ] a skilled run profile still needs at least the documented number of runs to max a
        hero and to complete the workshop tree;
  - [ ] no single currency lets a player max everything below the documented floor;
  - [ ] score may still explode while account/meta power stays bounded.
- [ ] The manual pacing targets in `docs/BALANCE.md` (first 10 min, first 30 min, after 2
      hours) still hold.

## Process

- [ ] Every v15 system landed as a small isolated PR in the order defined in `docs/V15_PLAN.md`.
- [ ] Every PR ran the full verification gate:
      `npm run check`, `npm run balance:check`, `npm run smoke`, `npm run smoke:browser`,
      `npm run simulate`, `npm run build`, `git diff --check`.
- [ ] Generated `dist/` changed only through build scripts; no timestamp-only churn committed.
- [ ] No conflicting wording remains stating v15 is unfinished once acceptance passes.
- [ ] v16 (mobile/PWA) and v17 (online) were NOT started during v15.

## Out of scope confirmation

- [ ] No online/backend/leaderboard work was done (deferred to v17, post-1.0).
- [ ] No mobile/PWA polish work was done (deferred to v16).
- [ ] No specific tower game was cloned in names, UI text, layout, art, or identity.
