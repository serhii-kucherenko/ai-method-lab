# Ion Hydrogel Studio — lessons

Product: `projects/ion-hydrogel-studio`  
Paper: ChemRxiv 10.26434/chemrxiv.15004897/v2

## What shipped

- Soft-sim studio for materials / soft-matter electrolyte analytics leads comparing **dynamic charge regulation** to **fixed-charge baselines**.
- Domain routes: packs, gels, charges, salts, assays, compare, scoreboard — not jobs/lifecycle/scenario shells.
- Dual A/B scoring, ≥30 goldens (`ih-001`…`ih-030`), ≥5 named flows, commercial surfaces, platform must-haves (auth, audit, export, webhook, org/members).

## Category practices

| Practice | Shipped |
|----------|---------|
| Goldens + dual compare | Yes |
| Scoreboard / leaderboard | Yes |
| Versioned packs | Yes |
| Honesty fence | Yes (membrane manufacturing / plant ionics / battery cell qualification) |
| Audit + export + webhook | Yes |

## Deferrals

- No wet-lab membrane manufacturing or live plant ionics APIs (honesty).
- No authors' code port (none published).

## Anti-patterns avoided

- Desk noun-swap (jobs/lifecycle/scenario shells).
- Single happy-path only.
- Claiming membrane manufacturing, live plant ionics, or commercial battery cell qualification.
