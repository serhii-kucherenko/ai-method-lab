# API-CONTRACT — Stale Flag Studio

Bearer auth on `/api/*` unless noted. Soft-sim only - not a live feature-flag vendor.

## Platform
| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/health` | Public |
| GET | `/api/features` | Feature inventory |
| GET | `/api/goldens/sample` | Dual-impl samples |
| GET/PATCH | `/api/org` | Settings |
| GET/POST | `/api/members` | Members |
| POST | `/api/webhooks/test` | HMAC; `Idempotency-Key` |
| GET | `/api/export` | `kind=flags\|debt\|compares` |

## Domain
| Method | Path | Notes |
|--------|------|-------|
| GET/POST | `/api/projects` | Flag projects |
| GET/POST | `/api/flags` | Inventory |
| GET/PATCH | `/api/flags/:id` | Update / archive |
| GET/POST | `/api/owners` | Owner mappings |
| GET/POST | `/api/imports` | Inventory sync batches |
| GET | `/api/imports/:id` | Batch status |
| GET/POST | `/api/debt` | Compute/list debt findings |
| GET/POST | `/api/freezes` | Freeze windows |
| GET/POST | `/api/cleanups` | Cleanup cases |
| PATCH | `/api/cleanups/:id` | Action / dismiss |
| POST | `/api/compares` | `{ mode: "debt_vs_ignore" }` |
| GET | `/api/compares/:id` | Winner + debt delta |
| GET | `/api/scoreboard` | Project rollups |

## Errors
`401` auth · `403` org · `409` idempotency · `422` validation (missing inventory for classify)
