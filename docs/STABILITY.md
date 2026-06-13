# Stability Notes

## v13 mål

v13 er ikke en feature-version. Det er en stabilitetsversion.

## Runtime error overlay

Fejl i browseren vises som overlay, så man ikke skal åbne DevTools på mobil for at se hvad der gik galt.

## Save eksport/import

Spillet bruger localStorage. Det er fint til prototype, men sårbart.

Derfor:

- eksportér save før store balanceændringer
- importér save efter test
- reset kun når du vil starte helt rent

## Build checks

`npm run check` gør følgende:

- tjekker nødvendige filer
- tjekker at alle 24 game parts findes
- bygger `dist/app.bundle.js`
- kører `node --check`
- tjekker vigtige symboler

## Source hash

`dist/build-meta.json` indeholder hash over source-parts. Det gør det nemmere at se om bundle faktisk matcher kildekoden.

## Næste stabilitetsopgaver

- Playwright/browser smoke test
- simpel test-run med seed uden rendering
- replay validation senere med server
- auto-save migration versionering
