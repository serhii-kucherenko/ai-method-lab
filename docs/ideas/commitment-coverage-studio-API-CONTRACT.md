# API-CONTRACT — Commitment Coverage Studio

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
| GET | `/api/export` | `kind=commitments\|gaps\|compares` |

## Domain
| Method | Path | Notes |
|--------|------|-------|
| GET/POST | `/api/accounts` | Cloud accounts |
| GET/POST | `/api/commitments` | Inventory |
| GET/PATCH | `/api/commitments/:id` | Update / archive |
| GET/POST | `/api/imports` | Usage/billing batches |
| GET | `/api/imports/:id` | Batch status |
| GET/POST | `/api/coverage` | Compute/list snapshots |
| GET | `/api/gaps` | Gap findings |
| GET/POST | `/api/renewals` | Renewal cases |
| PATCH | `/api/renewals/:id` | Action / dismiss |
| POST | `/api/compares` | `{ mode: "commit_vs_ondemand" }` |
| GET | `/api/compares/:id` | Winner + $ delta |
| GET | `/api/scoreboard` | Rollups |

## Errors
`401` auth · `403` org · `409` idempotency · `422` validation (missing usage for coverage)
