# API-CONTRACT — Schema Drift Studio

Bearer auth on `/api/*` unless noted. Soft-sim only - not a live database migrator.

## Platform
| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/health` | Public |
| GET | `/api/features` | Feature inventory |
| GET | `/api/goldens/sample` | Dual-impl samples |
| GET/PATCH | `/api/org` | Settings |
| GET/POST | `/api/members` | Members |
| POST | `/api/webhooks/test` | HMAC; `Idempotency-Key` |
| GET | `/api/export` | `kind=packs\|drifts\|compares` |

## Domain
| Method | Path | Notes |
|--------|------|-------|
| GET/POST | `/api/services` | Data services |
| GET/POST | `/api/packs` | Approved migration packs |
| GET/PATCH | `/api/packs/:id` | Update / archive |
| GET/POST | `/api/schemas` | Schema snapshots |
| GET | `/api/schemas/:id` | Snapshot detail |
| GET/POST | `/api/imports` | Pack or snapshot batches |
| GET | `/api/imports/:id` | Batch status |
| GET/POST | `/api/drifts` | Compute/list drift findings |
| GET/POST | `/api/gates` | Release gates |
| GET/POST | `/api/evidence` | Evidence cases |
| PATCH | `/api/evidence/:id` | Action / dismiss |
| POST | `/api/compares` | `{ mode: "pack_vs_live" }` |
| GET | `/api/compares/:id` | Winner + drift delta |
| GET | `/api/scoreboard` | Service rollups |

## Errors
`401` auth · `403` org · `409` idempotency · `422` validation (missing pack or snapshot)
