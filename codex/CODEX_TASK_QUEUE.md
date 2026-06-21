# Codex Task Queue (STRICT)

This is the operational control surface for Codex. Work **one task at a time, in order**.
Do not skip, reorder, batch, or start a later task before the current one is merged. The full
design intent + per-task Allowed/Forbidden/Acceptance live in `docs/V15_PLAN.md`; this file is
the order, the status, and the standing rules.

## Standing rules (apply to EVERY task)

1. One task = one PR. Only work the next `TODO` task in the queue below.
2. A task that introduces new balance values, a new currency flow, or a new system shape MUST
   land a `-design` docs-only sub-PR first, then a separate `-impl` PR.
3. Run the full verification gate before every PR and paste the results in the PR description:
   ```bash
   npm run check
   npm run balance:check
   npm run smoke
   npm run smoke:browser
   npm run simulate
   npm run build
   git diff --check
   git status --short
   ```
   `simulate` is the only check that actually runs the game. If it is not green, the PR is not
   ready.
4. Never edit generated `dist/` by hand; rebuild via build scripts. Do not commit
   `dist/build-meta.json` timestamp-only churn.
5. Preserve gameplay, balance, economy, save keys, and UI flow unless THIS task scopes the
   change. Save changes are additive + migrated only.
6. Daily Mine and Duel must stay fair (standard build) in every task.
7. Determinism must stay green: same seed = same run.
8. Stay inside the task's Allowed list. If the task seems to require something Forbidden, STOP
   and report instead of expanding scope.
9. Every implementation PR must update the status/docs/queue in the same PR so stale
   follow-up cleanup PRs are not needed. At minimum, update the completed task status, the
   next task pointer, relevant acceptance/status docs when the task changes them, and the PR
   description's next recommended task.
10. PR description must list: changed files, risk, checks run (with results), and the next
   recommended task.
11. Read `docs/V15_PLAN.md`, `docs/ECONOMY.md`, `docs/GAME_DESIGN.md`, and
    `docs/TOWER_INSPIRED_DIRECTION.md` before any gameplay task.

## Gate rule

- v15 implementation may proceed only from the next `TODO` row after the previous row is merged.
- v16 may begin only after `docs/V15_ACCEPTANCE.md` passes.
- v17 (online) is post-1.0 and requires explicit approval + a threat-model doc.

## Queue

| # | Task ID | Goal (one line) | Type | Status |
|---|---|---|---|---|
| 0 | V15-PLAN | This planning doc set (genre lock, plan, acceptance, economy, queue) | docs-only | DONE (this PR) |
| 1 | V15-01 | Mine Core entity + breach line + lose-on-Core-0 (Survival) | impl (small) | DONE (PR #30) |
| 2 | V15-02 | Core HP + wave HUD readability | impl (render) | TODO |
| 3 | V15-03 | Wave director (deterministic, telegraphed waves) | design + impl | TODO |
| 4 | V15-04 | In-run upgrade drafts (run-only, 3-choice) | design + impl | TODO |
| 5 | V15-05 | Elite waves (telegraphed variants) | impl | TODO |
| 6 | V15-06 | Boss waves (pattern + bounded reward) | design + impl | TODO |
| 7 | V15-07 | Workshop (bounded permanent upgrades, scrap sink) | design + impl | TODO |
| 8 | V15-08 | Cards (original modifiers, bounded active slots) | design + impl | TODO |
| 9 | V15-09 | Lab/research slot expansion (data sink) | design + impl | TODO |
| 10 | V15-10 | Milestones (meaningful, bounded) | impl | TODO |
| 11 | V15-11 | Difficulty tiers (bounded multipliers) | design + impl | TODO |
| 12 | V15-12 | Economy pass + committed balance-regression check in CI | impl | TODO |
| 13 | V15-13 | v15 acceptance verification + status cleanup | docs-only | TODO |

After V15-13 passes, stop and request the v16 planning task. Do not start v16 implementation.

## Copy-paste task prompt template

Use this to drive Codex for each row. Fill `<ID>` and pull the Goal/Allowed/Forbidden/
Acceptance verbatim from `docs/V15_PLAN.md`.

```txt
Task: <ID> — <one-line goal>

Work from latest main. Read first:
- codex/CODEX_TASK_QUEUE.md
- docs/V15_PLAN.md (find section <ID>)
- docs/ECONOMY.md
- docs/GAME_DESIGN.md
- docs/TOWER_INSPIRED_DIRECTION.md

Scope: implement ONLY <ID> as defined in docs/V15_PLAN.md. If it requires new balance values,
a new currency flow, or a new system shape, make a docs-only <ID>-design PR first, then a
separate <ID>-impl PR. Do not start any other queue task.

Allowed: <paste Allowed from V15_PLAN>
Forbidden: <paste Forbidden from V15_PLAN> + everything in the Standing rules.
Survival only unless the task says otherwise. Daily/Duel stay fair. Determinism stays green.
Save changes additive + migrated. dist/ only via build scripts.

Acceptance: <paste Acceptance from V15_PLAN>

Also update status/docs/queue in this same PR:
- mark <ID> complete when the implementation is complete;
- move the next-task pointer to the next strict queue item;
- update relevant acceptance/status docs when the task changes them;
- include the next recommended task in the PR description.

Run and report (paste results):
  npm run check
  npm run balance:check
  npm run smoke
  npm run smoke:browser
  npm run simulate
  npm run build
  git diff --check
  git status --short

PR description must list: changed files, risk, checks run (with results), next recommended task.
Do not implement anything beyond <ID>.
```
