# Task 03: Save system hardening

Tilføj tests for save migrations og corrupt save handling.

## Status: færdig (PR #10)

`tools/save-migration-check.mjs` dækker gammel-schema-migration, malformed nested
data, primitive/non-object imports og future-version normalisering. Den kører som
`npm run save:check` og er en del af `npm run check` + CI.

Accept:
- [x] Automatiseret migrationstest findes
- [x] Malformed/legacy/future saves håndteres uden at overskrive aktiv save
- [x] Kører i `npm run check` og CI
