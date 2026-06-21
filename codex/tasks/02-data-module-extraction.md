# Task 02: Data module extraction

Flyt statiske data-konstanter fra `src/game/parts/*` til rene moduler i
`src/game/data/`, ét lille slice ad gangen, uden at ændre værdier eller adfærd.

Kandidater: `DATA`, `CAMPAIGN_LEVELS`, `SKILLS`, `WEAPONS`, `CHARACTERS`, `RESEARCH`.

## Status

✅ Færdig for de planlagte v14 data-slices.

Auto-status i `codex/CODEX_START_HERE.md` viser ingen planlagte inline mål tilbage:
`DATA`, `CAMPAIGN_LEVELS`, `SKILLS`, `WEAPONS`, `CHARACTERS` og `RESEARCH` er flyttet
til `src/game/data/` sammen med de øvrige nødvendige data-symboler. De utracked inline
symboler `ACH`, `GATE_COLOR` og `GATE_TIP` er kun synlighed i statusrapporten og er ikke
planlagte Task 02-mål, medmindre en senere opgave eksplicit beslutter det.

Åbn ikke mere Task 02 slice-arbejde fra denne fil. Næste autoritative opgave findes i
`codex/CODEX_START_HERE.md` og er `v15 planning: Mine Core survival loop design`, docs-only.

## Historisk fremgangsmåde (pr. slice)

Denne sektion bevares kun som arkiv for, hvordan Task 02-slices blev udført.

1. Opret `src/game/data/<navn>.js` med den **identiske** konstant (samme værdier).
2. Fjern den inline-deklaration fra den relevante part.
3. Tilføj filen til `dataFiles` i `tools/build-game-bundle.mjs` (ellers er den ikke i bundlen).
4. Rebuild via build-scripts og verificér.

## Guardrails

- Ingen ændring af tal, balance, økonomi, save-nøgler, UI-flow eller gameplay.
- Start ikke nye data-slice flytninger uden en ny eksplicit opgave.
- Rediger aldrig `dist/` manuelt.

## Accept (opfyldt)

- [x] Planlagte data-slices flyttet uændret til `src/game/data/`
- [x] Flyttede datafiler tilføjet til `dataFiles` i bundleren
- [x] `npm run check` passerer
- [x] `npm run balance:check` passerer
- [x] `npm run smoke` passerer
- [x] `npm run smoke:browser` passerer
- [x] `npm run simulate` passerer
- [x] `npm run build` regenererer `dist/`
