# PAGE-SPECS — Commitment Coverage Studio

Design tokens: `commitment-coverage-studio-DESIGN.md`. Blueprint: `commitment-coverage-studio-COMPREHENSIVE-BLUEPRINT.md`.

## Marketing / commercial

| Route | Job | Must show | Must not |
|-------|-----|-----------|----------|
| `/` | Sell $ gap before renewal | Brand-first hero; CTA `/commitments` + `/demo` | Stats/cards in first viewport; invented metrics |
| `/pricing` | Seats + connected accounts | Evaluator / Platform / Site tiers | Real card checkout |
| `/demo` | Guided dual claim | Import → match → gap → renew; A vs B | Skip honesty |
| `/onboarding` | Checklist + progress | Visible progress | Empty docs wall |
| `/flows` | ≥5 journeys | Named CTAs | Footer-only |
| `/honesty` | Soft-sim fence | Not billing SOR; not Idle Seat/True Up | Fake compliance badges |

## Domain

| Route | Job | Empty / error |
|-------|-----|----------------|
| `/commitments` | Inventory CRUD | Import or add first commit |
| `/coverage` | Coverage $ / % by account/window | Need usage import |
| `/gaps` | Under-cover + unused commit | No gaps in window |
| `/renewals` | Renewal cases + actions | No renew-by dates |
| `/imports` | Billing/usage batches | Failed batch detail |
| `/compare` | A commit-matched vs B on-demand-blind | Need both paths |
| `/scoreboard` | Rollups | Empty org |
| `/settings` | Org, members, webhook, export | Validation errors |

## Forbidden IA
`/jobs` `/lifecycle` `/scenario` `/batch` `/goldens` as primary nav.
