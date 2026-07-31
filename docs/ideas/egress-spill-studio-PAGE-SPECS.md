# PAGE-SPECS — Egress Spill Studio

Design tokens: `egress-spill-studio-DESIGN.md`. Blueprint: `egress-spill-studio-COMPREHENSIVE-BLUEPRINT.md`.

## Marketing / commercial

| Route | Job | Must show | Must not |
|-------|-----|-----------|----------|
| `/` | Sell $ spill before invoice | Brand-first hero; CTA `/budgets` + `/demo` | Stats/cards in first viewport; invented metrics |
| `/pricing` | Seats + egress-window sync | Evaluator / Platform / Site tiers | Real card checkout |
| `/demo` | Guided dual claim | Budget → egress → spill → invoice; A vs B | Skip honesty |
| `/onboarding` | Checklist + progress | Visible progress | Empty docs wall |
| `/flows` | ≥5 journeys | Named CTAs | Footer-only |
| `/honesty` | Soft-sim fence | Not billing SOR; not Commitment Coverage / Cost Explorer | Fake compliance badges |

## Domain

| Route | Job | Empty / error |
|-------|-----|----------------|
| `/budgets` | Transfer budget CRUD | Import or add first |
| `/egress` | Egress / transfer usage | Need import |
| `/spills` | Over-budget spill $ | No spill in window |
| `/invoices` | Invoice cases + actions | None open |
| `/imports` | Billing/usage batches | Failed batch detail |
| `/compare` | A budget-aware vs B ignore-egress | Need both paths |
| `/scoreboard` | Account rollups | Empty org |
| `/settings` | Org, members, webhook, export | Validation errors |

## Forbidden IA
`/jobs` `/lifecycle` `/scenario` `/batch` `/goldens` as primary nav.
