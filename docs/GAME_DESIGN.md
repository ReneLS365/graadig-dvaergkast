# Game Design

## Core fantasy

Du forsvarer og styrker en neon Mine Core / Dwarf Core dybt under jorden, mens grådige dværge kæmper gennem farlige waves for guld, skrot, data og relics.

Spilleren skal føle:

```txt
Jeg døde fordi jeg blev grådig.
Jeg holdt Mine Core i live længere med et smartere build.
Jeg vil lige have nok skrot, data eller relic-progress til én forbedring mere.
```

## Design direction

GRÅDIG skal udvikle sig mod en original neon dwarf/mine wave survival roguelite. Retningen bruger kun højniveau strukturel inspiration fra tower-survival progression games:

- central arena / Mine Core
- wave-based survival
- in-run upgrades
- permanent workshop upgrades
- card collection og active card slots
- lab/research slots
- milestones
- difficulty tiers
- kontrolleret langsigtet progression
- mobile-first neon UI

GRÅDIG må ikke klone nogen specifik tower game. Kopiér ikke navne, UI-tekst, exact layout, progression, icons, art eller beskyttet identitet. GRÅDIG skal fortsat eje sin egen fantasy: dwarves, mines, greed, neon, scrap, gold, data, relics, weapons, heroes og Dwarf Core / Mine Core.

Se også `docs/TOWER_INSPIRED_DIRECTION.md` for den låste retning.

## Target survival loop

1. Spilleren går ind i den neonoplyste mine arena.
2. Dwarf Core / Mine Core skal overleve eskalerende waves.
3. Spilleren samler gold, scrap, data og relic fragments.
4. Mid-run valg giver temporary upgrades til den aktuelle run.
5. Elite waves, bosses, hazards og greed-valg tester build og skill.
6. Efter death eller extraction bankes kontrollerede permanente rewards.
7. Rewards bruges på workshop, weapons, heroes, research, cards og core progression.
8. Milestones og difficulty tiers åbner dybere mål uden at ødelægge fairness.

## Modes

### Overlevelse

Primær mode. Survival er hjemmet for Mine Core fantasy, escalating waves, loot crates, våben, skrot, data, relics, mid-run upgrades, milestones og langsigtet progression.

### Kampagne

Baner med mål, stigende sværhedsgrad og stjerner. Kampagne skal fungere som træning, onboarding og skill-test, ikke som den primære grind.

### Dagens Mine

Fair mode. Samme seed og standard-build for alle. Leaderboard uden pay-to-win.

### Duel

Samme seed og målscore. Social konkurrence. Duel må ikke afhænge af owned gear, medmindre en fremtidig opgave eksplicit designer separate fair/progression variants.

## Progression

Progressionen skal være langsommere end score-eksplosionen. Score må være vild. XP, data, level, workshop progress, card power og research skal være kontrolleret.

Permanent progression må give flere muligheder og tydelig fremgang, men må ikke erstatte skill. Daily og Duel skal fortsat beskyttes mod pay-to-win progression.

## Fairness

```txt
Daily + Duel = standard-build
Survival + Campaign + Random + Chaos = dit build gælder
```

Det beskytter konkurrencen uden at dræbe progressionen.

## v14 boundary

Denne retning guider refactor-arbejdet, men v14 må ikke implementere nye gameplay systems, balance changes eller UI redesigns uden en specifik opgave. v14 skal stabilisere koden, så v15 kan tilføje content i små sikre PRs.
