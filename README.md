# GRÅDIG: Dværgkast Survival+ v14 Core Refactor

GitHub/Codex-klar repo-version.

## Hurtig start

```bash
npm install
npm run build
npm run dev
```

## Termux uden Node

```bash
cd /sdcard/Download
unzip graadig-dvaergkast-v14-core-refactor.zip
cd graadig-dvaergkast-v14-core-refactor
python -m http.server 8080
```

Åbn:

```txt
http://127.0.0.1:8080
```

## Scripts

```bash
npm run build:game
npm run build:single
npm run check
npm run balance:check
npm run smoke
npm run build
npm run simulate
npm run clean
```

## Codex

Start her:

```txt
codex/CODEX_START_HERE.md
```

Første opgave:

```txt
codex/tasks/01-game-state-extraction.md
```

## Struktur

```txt
src/game/parts/      # nuværende spil-runtime
src/game/core/       # GameState, migrations, math, rng
src/game/data/       # kommende data modules
src/game/systems/    # kommende systems
src/game/render/     # kommende render split
codex/tasks/         # Codex-opgaver
.github/workflows/   # CI
docs/                # handoff/acceptance/design
tools/               # build/check/smoke scripts
dist/                # generated bundle/single
```
