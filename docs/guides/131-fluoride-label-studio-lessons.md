# Fluoride Label Studio — lessons

Product: `projects/fluoride-label-studio`  
Paper: ChemRxiv 10.26434/chemrxiv.15005804/v2

## What shipped

- Soft-sim studio for PET tracer chemistry leads comparing **fast isotopic [18F]fluoride exchange** to **multistep prosthetic baselines**.
- Domain routes: packs, precursors, exchanges, tracers, assays, compare, scoreboard — not jobs/lifecycle/scenario shells.
- Dual A/B scoring, ≥30 goldens (`fl-001`…`fl-030`), ≥5 named flows, commercial surfaces, platform must-haves (auth, audit, export, webhook, org/members).

## Category practices

| Practice | Shipped |
|----------|---------|
| Goldens + dual compare | Yes |
| Scoreboard / leaderboard | Yes |
| Versioned packs | Yes |
| Honesty fence | Yes (GMP / cyclotron / clinical dosing) |
| Audit + export + webhook | Yes |

## Deferrals

- No wet-lab integration or live cyclotron APIs (honesty).
- No authors' code port (none published).

## Anti-patterns avoided

- Desk noun-swap (libraries/cycles/hits → precursors/exchanges/tracers with fluorine-18 language).
- Single happy-path only.
- Claiming GMP batch release or clinical PET dosing.
