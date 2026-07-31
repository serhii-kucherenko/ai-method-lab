# PAGE-SPECS — Canary Budget Studio

Design tokens: `canary-budget-studio-DESIGN.md`. Blueprint: `canary-budget-studio-COMPREHENSIVE-BLUEPRINT.md`.

## Marketing / commercial

| Route | Job | Must show | Must not |
|-------|-----|-----------|----------|
| `/` | Sell budget before promote | Brand-first hero; CTA `/rollouts` + `/demo` | Stats/cards in first viewport; invented metrics |
| `/pricing` | Seats + canary-window sync | Evaluator / Platform / Site tiers | Real card checkout |
| `/demo` | Guided dual claim | Rollout → budget → promote/hold; A vs B | Skip honesty |
| `/onboarding` | Checklist + progress | Visible progress | Empty docs wall |
| `/flows` | ≥5 journeys | Named CTAs | Footer-only |
| `/honesty` | Soft-sim fence | Not live mesh; not Eval Budget / Flagger UI | Fake compliance badges |

## Domain

| Route | Job | Empty / error |
|-------|-----|----------------|
| `/rollouts` | Canary inventory | Import or add first |
| `/budgets` | Remaining error budget | No active window |
| `/signals` | SLO / error / latency | Need import |
| `/decisions` | Promote / hold / rollback | None open |
| `/imports` | Metrics sync batches | Failed batch detail |
| `/compare` | A budget-aware vs B ship-anyway | Need both paths |
| `/scoreboard` | Service rollups | Empty org |
| `/settings` | Org, members, webhook, export | Validation errors |

## Forbidden IA
`/jobs` `/lifecycle` `/scenario` `/batch` `/goldens` as primary nav.
