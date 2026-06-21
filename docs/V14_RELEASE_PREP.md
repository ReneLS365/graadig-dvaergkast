# v14 Stable Release Verification

## Scope

v14 is the core refactor and stability foundation for GRÅDIG: Dværgkast Survival+. Its purpose is to leave the playable browser build stable, verifiable, and ready for later modular development while preserving current gameplay, balance, economy, save behavior, and generated build flow.

v14 remains a conservative stabilization milestone. It does not include new survival content, cards, workshop systems, lab systems, bosses, leaderboards, PWA work, balance changes, runtime feature work, save format changes, or generated `dist/` source edits.

## Completed v14 Tasks

- Design direction is locked for an original neon dwarf/mine wave survival roguelite with Dwarf Core / Mine Core identity.
- GameState refactor scaffolding is in place and the completed extraction work is documented in the v14 handoff/status docs.
- Planned data module extraction is complete for the scoped data slices; remaining visible inline symbols are not planned Task 02 targets unless a later task explicitly scopes them.
- Save migration hardening is complete and covered by automated checks.
- Headless deterministic simulation is available and wired into the verification flow.
- Browser-like smoke coverage is available and wired into CI.
- Build, smoke, balance, save, economy, and documentation checks are documented as the required release gate.

## Required Verification Checks

These checks were the required gate for marking v14 stable and remain required for follow-up PRs:

```bash
npm run check
npm run balance:check
npm run smoke
npm run smoke:browser
npm run simulate
npm run build
git diff --check
```

## Known Safe Limitations

- `dist/` artifacts are generated outputs. Timestamp-only `dist/build-meta.json` churn is safe to discard when source hashes do not change.
- `check` and `smoke` include syntax/build/text-level coverage but do not prove gameplay execution on their own; `simulate` and `smoke:browser` close that gap.
- Local-first save storage remains prototype-oriented browser `localStorage`; migration hardening reduces malformed-save risk but does not turn saves into cloud-backed accounts.
- Task 02 intentionally leaves `ACH`, `GATE_COLOR`, and `GATE_TIP` as visible untracked inline symbols, not active v14 extraction blockers.
- v14 prepares folders and boundaries for later work, but does not implement v15 gameplay systems.

## v14 Stable Status

v14 is stable after release-prep verification. The milestone is a completed stability foundation, not a content expansion release. Keep the required verification checks listed above unchanged for any final tag or follow-up documentation PR.

## v15 Planning Boundary

v15 may begin only with a planning/design PR first. The next recommended task is `v15 planning: Mine Core survival loop design`, docs-only. That planning PR may describe the Mine Core survival loop, scope, risks, acceptance criteria, and rollout sequencing, but must not implement Mine Core gameplay, cards, workshop, lab/research expansion, bosses, leaderboards, PWA work, new survival systems, new economy progression, balance changes, save/data changes, runtime changes, or generated `dist/` changes.
