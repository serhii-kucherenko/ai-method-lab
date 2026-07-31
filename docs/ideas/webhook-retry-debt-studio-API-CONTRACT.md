# API-CONTRACT — Webhook Retry Debt Studio

Bearer auth on `/api/*` unless noted. Soft-sim only - not a live message broker.

## Platform
| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/health` | Public |
| GET | `/api/features` | Feature inventory |
| GET | `/api/goldens/sample` | Dual-impl samples |
| GET/PATCH | `/api/org` | Settings |
| GET/POST | `/api/members` | Members |
| POST | `/api/webhooks/test` | HMAC; `Idempotency-Key` |
| GET | `/api/export` | `kind=destinations\|debt\|compares` |

## Domain
| Method | Path | Notes |
|--------|------|-------|
| GET/POST | `/api/destinations` | Outbound destinations |
| GET/PATCH | `/api/destinations/:id` | Update / archive |
| GET/POST | `/api/deliveries` | Delivery attempts |
| GET | `/api/deliveries/:id` | Attempt detail |
| GET/POST | `/api/imports` | Delivery sync batches |
| GET | `/api/imports/:id` | Batch status |
| GET/POST | `/api/debt` | Compute/list debt findings |
| GET/POST | `/api/reviews` | Incident reviews |
| GET/POST | `/api/cleanups` | Cleanup cases |
| PATCH | `/api/cleanups/:id` | Action / dismiss |
| POST | `/api/compares` | `{ mode: "debt_vs_ignore" }` |
| GET | `/api/compares/:id` | Winner + debt delta |
| GET | `/api/scoreboard` | Destination rollups |

## Errors
`401` auth · `403` org · `409` idempotency · `422` validation (missing deliveries for classify)
