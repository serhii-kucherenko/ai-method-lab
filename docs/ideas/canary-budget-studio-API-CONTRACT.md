# API-CONTRACT — Canary Budget Studio

Bearer auth on `/api/*` unless noted. Soft-sim only - not a live cluster or mesh controller.

## Platform
| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/health` | Public |
| GET | `/api/features` | Feature inventory |
| GET | `/api/goldens/sample` | Dual-impl samples |
| GET/PATCH | `/api/org` | Settings |
| GET/POST | `/api/members` | Members |
| POST | `/api/webhooks/test` | HMAC; `Idempotency-Key` |
| GET | `/api/export` | `kind=rollouts\|budgets\|compares` |

## Domain
| Method | Path | Notes |
|--------|------|-------|
| GET/POST | `/api/services` | Services |
| GET/POST | `/api/rollouts` | Canary rollouts |
| GET/PATCH | `/api/rollouts/:id` | Update / archive |
| GET/POST | `/api/imports` | Metrics sync batches |
| GET | `/api/imports/:id` | Batch status |
| GET/POST | `/api/signals` | SLO signal slices |
| GET/POST | `/api/budgets` | Compute/list error budgets |
| GET/POST | `/api/decisions` | Promote/hold cases |
| PATCH | `/api/decisions/:id` | Action / dismiss |
| POST | `/api/compares` | `{ mode: "budget_vs_ship" }` |
| GET | `/api/compares/:id` | Winner + burn delta |
| GET | `/api/scoreboard` | Service rollups |

## Errors
`401` auth · `403` org · `409` idempotency · `422` validation (missing signals for budget)
