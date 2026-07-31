# PAGE-SPECS — Webhook Retry Debt Studio

Design tokens: `webhook-retry-debt-studio-DESIGN.md`. Blueprint: `webhook-retry-debt-studio-COMPREHENSIVE-BLUEPRINT.md`.

## Marketing / commercial

| Route | Job | Must show | Must not |
|-------|-----|-----------|----------|
| `/` | Sell debt queue before review | Brand-first hero; CTA `/destinations` + `/demo` | Stats/cards in first viewport; invented metrics |
| `/pricing` | Seats + debt-sync usage | Evaluator / Platform / Site tiers | Real card checkout |
| `/demo` | Guided dual claim | Import → debt → cleanup; A vs B | Skip honesty |
| `/onboarding` | Checklist + progress | Visible progress | Empty docs wall |
| `/flows` | ≥5 journeys | Named CTAs | Footer-only |
| `/honesty` | Soft-sim fence | Not live broker; not Stale Flag / settings-only ping | Fake compliance badges |

## Domain

| Route | Job | Empty / error |
|-------|-----|----------------|
| `/destinations` | Destination CRUD | Import or add first |
| `/deliveries` | Attempt inventory | Need import |
| `/debt` | Failed / pending / DLQ | No debt in window |
| `/reviews` | Reviews + cleanup cases | None scheduled |
| `/imports` | Sync batches | Failed batch detail |
| `/compare` | A debt-aware vs B ignore-backlog | Need both paths |
| `/scoreboard` | Destination rollups | Empty org |
| `/settings` | Org, members, webhook, export | Validation errors |

## Forbidden IA
`/jobs` `/lifecycle` `/scenario` `/batch` `/goldens` as primary nav.
