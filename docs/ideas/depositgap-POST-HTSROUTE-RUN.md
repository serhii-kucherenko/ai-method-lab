# depositgap — post-htsroute activation run sheet

Use **after** `htsroute` parked/killed/cleared. Granularity: **hours**, not calendar days.

## Preconditions

1. `current_product` null (or prior product sustained/parked).  
2. Hour hold for this idea’s `framing_started_at` ≥ `min_hours_research_before_ready` before `ready_to_build`.  
3. Architect pack on file: VISION / ROADMAP / PRD / ERD + blueprint.  
4. Prefer over lesserof / oshamult / ptax per `ACTIVATION_QUEUE.md`.

## Re-read

Challenge ABC, VALUE-STAKES, PRODUCT-FRAMING, DAY-COUNT, GATE-SCORECARD, G6, ACCEPTANCE, blueprint + page specs + phase briefs, sustain matrix, API contract, HYPOTHESIS-DRAFT, 6621 fence.

## Checkers

```text
node docs/ideas/check-depositgap-fixtures.mjs
node docs/ideas/check-depositgap-dual.mjs
node demos/smoke-try-demos.mjs
```

## If all pass

1. `current_idea` → depositgap.  
2. `ready_to_build` when gates hold.  
3. Open **comprehensive** `projects/depositgap/` per DAY1-NONSMOKE + REPO-SCAFFOLD + AGENT_ROLES.  
4. Digests: forecast honesty; brokers/CBP still liquidate.

## Status (2026-07-21 ~17:30 PDT)

htsroute **parked**. depositgap **activated**. Architect pack present. Seed hours ≫ 4h. Product delivery starting smoke.
