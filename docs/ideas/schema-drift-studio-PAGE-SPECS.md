# PAGE-SPECS — Schema Drift Studio

Design tokens: `schema-drift-studio-DESIGN.md`. Blueprint: `schema-drift-studio-COMPREHENSIVE-BLUEPRINT.md`.

## Marketing / commercial

| Route | Job | Must show | Must not |
|-------|-----|-----------|----------|
| `/` | Sell evidence before gate | Brand-first hero; CTA `/packs` + `/demo` | Stats/cards in first viewport; invented metrics |
| `/pricing` | Seats + drift-run usage | Evaluator / Platform / Site tiers | Real card checkout |
| `/demo` | Guided dual claim | Pack → snapshot → drift → evidence; A vs B | Skip honesty |
| `/onboarding` | Checklist + progress | Visible progress | Empty docs wall |
| `/flows` | ≥5 journeys | Named CTAs | Footer-only |
| `/honesty` | Soft-sim fence | Not live DDL; not Online Diff / Stale Flag | Fake compliance badges |

## Domain

| Route | Job | Empty / error |
|-------|-----|----------------|
| `/packs` | Approved pack CRUD | Import or add first pack |
| `/schemas` | Schema snapshots | Need import |
| `/drifts` | Drift findings | No mismatches |
| `/gates` | Release gates + evidence | None scheduled |
| `/imports` | Pack/snapshot batches | Failed batch detail |
| `/compare` | A pack-matched vs B live-as-is | Need both paths |
| `/scoreboard` | Service rollups | Empty org |
| `/settings` | Org, members, webhook, export | Validation errors |

## Forbidden IA
`/jobs` `/lifecycle` `/scenario` `/batch` `/goldens` as primary nav.
