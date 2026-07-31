# PAGE-SPECS — Stale Flag Studio

Design tokens: `stale-flag-studio-DESIGN.md`. Blueprint: `stale-flag-studio-COMPREHENSIVE-BLUEPRINT.md`.

## Marketing / commercial

| Route | Job | Must show | Must not |
|-------|-----|-----------|----------|
| `/` | Sell debt queue before freeze | Brand-first hero; CTA `/flags` + `/demo` | Stats/cards in first viewport; invented metrics |
| `/pricing` | Seats + inventory sync | Evaluator / Platform / Site tiers | Real card checkout |
| `/demo` | Guided dual claim | Import → debt → cleanup; A vs B | Skip honesty |
| `/onboarding` | Checklist + progress | Visible progress | Empty docs wall |
| `/flows` | ≥5 journeys | Named CTAs | Footer-only |
| `/honesty` | Soft-sim fence | Not flag-vendor SOR; not Change Freeze / Delegation Expiry | Fake compliance badges |

## Domain

| Route | Job | Empty / error |
|-------|-----|----------------|
| `/flags` | Inventory CRUD | Import or add first flag |
| `/debt` | Stale / expired / unused | No debt in window |
| `/owners` | Owner / squad map | Unmapped flags |
| `/freezes` | Freeze windows + cleanup | None scheduled |
| `/imports` | Sync batches | Failed batch detail |
| `/compare` | A debt-aware vs B ignore-stale | Need both paths |
| `/scoreboard` | Project rollups | Empty org |
| `/settings` | Org, members, webhook, export | Validation errors |

## Forbidden IA
`/jobs` `/lifecycle` `/scenario` `/batch` `/goldens` as primary nav.
