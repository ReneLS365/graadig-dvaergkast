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

Status og resterende v14-opgaver: se `codex/CODEX_START_HERE.md`.

## v14 Release-readiness checklist

- [x] v14 status is final cleanup / release-readiness, not active feature or content development.
- [x] Task 02 planned data extraction is complete; no planned inline data-slice targets remain.
- [x] Task 05 browser smoke is complete and `npm run smoke:browser` is required before PR.
- [x] Required pre-PR checks are consistent: `npm run check`, `npm run balance:check`, `npm run smoke`, `npm run smoke:browser`, `npm run simulate`, `npm run build`, `git diff --check`, and `git diff --check`.
- [x] Generated `dist/` files are build artifacts only; they must only change through build scripts. Do not commit `dist/build-meta.json` timestamp-only churn.
- [x] Next work must stay small and conservative: docs, stability, verification, or release-prep only. Do not start v15 cards, workshop, lab, bosses, leaderboards, PWA, or new survival content yet.
