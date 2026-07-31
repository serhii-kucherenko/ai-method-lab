# API-CONTRACT — Contract Rate Variance Studio

Bearer auth on `/api/*` unless noted. Soft-sim only - not an AP or ERP system of record.

## Platform
| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/health` | Public |
| GET | `/api/features` | Feature inventory |
| GET | `/api/goldens/sample` | Dual-impl samples |
| GET/PATCH | `/api/org` | Settings |
| GET/POST | `/api/members` | Members |
| POST | `/api/webhooks/test` | HMAC; `Idempotency-Key` |
| GET | `/api/export` | `kind=catalog\|variances\|compares` |

## Domain
| Method | Path | Notes |
|--------|------|-------|
| GET/POST | `/api/vendors` | Vendors |
| GET/POST | `/api/catalog` | Contract catalogs |
| GET/POST | `/api/catalog/:id/skus` | SKUs / rates |
| GET/PATCH | `/api/skus/:id` | Update / archive |
| GET/POST | `/api/imports` | Catalog or invoice batches |
| GET | `/api/imports/:id` | Batch status |
| GET/POST | `/api/invoices` | Invoice batches |
| GET | `/api/invoices/:id/lines` | Lines |
| GET/POST | `/api/variances` | Compute/list rate variances |
| GET/POST | `/api/disputes` | Dispute cases |
| PATCH | `/api/disputes/:id` | Action / dismiss |
| POST | `/api/compares` | `{ mode: "catalog_vs_invoice" }` |
| GET | `/api/compares/:id` | Winner + $ delta |
| GET | `/api/scoreboard` | Vendor rollups |

## Errors
`401` auth · `403` org · `409` idempotency · `422` validation (missing catalog for match)
