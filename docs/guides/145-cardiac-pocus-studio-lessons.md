# Cardiac Pocus Studio — what we learned

Product slug: `cardiac-pocus-studio`

## Buyer story

Pulmonary / POCUS analytics leads need a soft-sim bench that compares **cardiac POCUS COPD detection patterns** to **lung-ultrasound baselines** before locking an exam pack — without claiming live diagnostic clearance, clinical advice, or PACS write-back.

## What shipped

- Domain IA: packs / exams / patterns / assays / compare / scoreboard (not jobs/lifecycle/scenario desks)
- Dual scorers: `cardiac_pocus_copd` (A) and `lung_ultrasound_baseline` (B)
- Goldens `cp-001` … `cp-030`
- ≥13 pages including `/`, `/pricing`, `/demo`, `/onboarding`, `/flows`, `/honesty`
- ≥5 flows: create pack → configure pattern → configure assay → A/B compare → export + webhook
- Platform must-haves: auth, org/members, audit, export, webhook, search, pagination, rate limit, settings
- Offline `try.html` approximate demo

## Category practices

Eval / imaging soft-sim bench: goldens, dual compare, scoreboard, versioned packs, honesty fence.

## Deferred

Live PACS connectors, regulatory clearance claims, clinical decision support — intentionally out of scope for method-lab soft-sim.

## Research input

https://doi.org/10.21203/rs.3.rs-9994279/v1 — not an authors’ product brand; no published authors’ code.
