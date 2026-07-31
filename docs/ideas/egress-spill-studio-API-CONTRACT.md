# API-CONTRACT — Egress Spill Studio

Bearer auth on `/api/*` unless noted. Soft-sim only - not a cloud billing system of record.

## Platform
| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/health` | Public |
| GET | `/api/features` | Feature inventory |
| GET | `/api/goldens/sample` | Dual-impl samples |
| GET/PATCH | `/api/org` | Settings |
| GET/POST | `/api/members` | Members |
| POST | `/api/webhooks/test` | HMAC; `Idempotency-Key` |
| GET | `/api/export` | `kind=budgets\|spills\|compares` |

## Domain
| Method | Path | Notes |
|--------|------|-------|
| GET/POST | `/api/accounts` | Cloud accounts |
| GET/POST | `/api/budgets` | Transfer budgets |
| GET/PATCH | `/api/budgets/:id` | Update / archive |
| GET/POST | `/api/imports` | Usage/billing batches |
| GET | `/api/imports/:id` | Batch status |
| GET/POST | `/api/egress` | Egress slices |
| GET/POST | `/api/spills` | Compute/list spill findings |
| GET/POST | `/api/invoices` | Invoice cases |
| PATCH | `/api/invoices/:id` | Action / dismiss |
| POST | `/api/compares` | `{ mode: "budget_vs_ignore" }` |
| GET | `/api/compares/:id` | Winner + $ delta |
| GET | `/api/scoreboard` | Account rollups |

## Errors
`401` auth · `403` org · `409` idempotency · `422` validation (missing usage for spill)
