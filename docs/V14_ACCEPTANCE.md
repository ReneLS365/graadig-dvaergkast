# v14 Acceptance Criteria

- [x] GitHub-klar ZIP
- [x] Codex tasks
- [x] CI
- [x] GameState scaffold
- [x] save migration scaffold + automatiseret save:check
- [x] verification checks: `npm run check`, `npm run balance:check`, `npm run smoke`, `npm run smoke:browser`, `npm run simulate`, `npm run build`, `git diff --check`
- [x] headless deterministisk sim-runner (`npm run simulate`, 100 seeds, i CI)
- [x] browser-like smoke test (`npm run smoke:browser`, starter Survival og kører frames uden fatal overlay, i CI)
- [x] modulær bundle kan faktisk køre (canvas/render-bootstrap + math/rng bundlet)

Status: v14 stable; v15 planning complete (PR #28); V15-01 complete (PR #30). Next task: `V15-02 — Core HP + wave HUD readability` from the strict ordered queue in `codex/CODEX_TASK_QUEUE.md`; see `codex/CODEX_START_HERE.md`.

## v14 Stable checklist

- [x] v14 status is stable, not active feature or content development.
- [x] Task 02 planned data extraction is complete; no planned inline data-slice targets remain.
- [x] Task 05 browser smoke is complete and `npm run smoke:browser` is required before PR.
- [x] Required pre-PR checks are consistent: `npm run check`, `npm run balance:check`, `npm run smoke`, `npm run smoke:browser`, `npm run simulate`, `npm run build`, and `git diff --check`.
- [x] Generated `dist/` files are build artifacts only; they must only change through build scripts. Do not commit `dist/build-meta.json` timestamp-only churn.
- [x] v15 planning is complete (PR #28) and V15-01 is complete (PR #30); implementation now proceeds from the strict ordered queue in `codex/CODEX_TASK_QUEUE.md`, one task at a time, with `V15-02 — Core HP + wave HUD readability` next. Each task follows its Allowed/Forbidden/Acceptance in `docs/V15_PLAN.md`.
