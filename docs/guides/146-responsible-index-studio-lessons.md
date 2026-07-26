# Responsible Index Studio — what we learned

Product slug: `responsible-index-studio`

## Buyer story

AI governance / public-policy analytics leads need a soft-sim bench that compares **structured country-level responsible-AI indexes** to **naive commitment checklists** before locking a country pack — without claiming live national policy authority, certified AI audits, or government command systems.

## What shipped

- Domain IA: packs / countries / dimensions / indicators / compare / scoreboard (not jobs/lifecycle/scenario desks)
- Dual scorers: `structured_country_index` (A) and `naive_commitment_checklist` (B)
- Goldens `ri-001` … `ri-030`
- ≥13 pages including `/`, `/pricing`, `/demo`, `/onboarding`, `/flows`, `/honesty`
- ≥5 flows: create pack → configure dimensions → configure indicators → A/B compare → export + webhook
- Platform must-haves: auth, org/members, audit, export, webhook, search, pagination, rate limit, settings
- Offline `try.html` approximate demo

## Category practices

Eval / governance soft-sim bench: goldens, dual compare, scoreboard, versioned packs, honesty fence.

## Deferred

Live national policy feeds, certified audit claims, government command integrations — intentionally out of scope for method-lab soft-sim.

## Research input

https://arxiv.org/abs/2607.14782v1 — not an authors’ product brand; no published authors’ code; not branded as GIRAI.
