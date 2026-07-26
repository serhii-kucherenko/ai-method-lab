# 135 — Coload Order Studio lessons

## What we shipped

A comprehensive soft-sim studio for **ordered chemo-photothermal co-load sequences** vs **simultaneous-load baselines** aimed at nanomedicine / formulation analytics leads.

## Category practices that landed

| Practice | Where |
|----------|--------|
| Versioned carrier packs | `/packs` |
| Carrier + load sequence workspace | `/carriers`, `/loads` |
| Assay soft-sim runs | `/assays` |
| Dual A/B compare + scoreboard | `/compare`, `/scoreboard` |
| Goldens ≥30 (`co-001`…`co-030`) | `src/goldens.ts` + fixtures |
| Org / members / audit / export / webhook | `/settings` + APIs |
| Commercial surfaces | `/pricing`, `/demo`, `/onboarding`, `/flows` |
| Honesty fence | `/honesty` + landing |

## What not to claim

- Wet-lab validated GMP nanomedicine manufacture
- Live patient dosing
- Clinical oncology clearance
- Authors’ HSN system branding

## Anti-clone note

Domain nouns are packs, carriers, loads, assays — not jobs / lifecycle / scenario shells, and not nanodomain / peptide cardio desks.

## Paper

https://doi.org/10.3390/nano16130805
