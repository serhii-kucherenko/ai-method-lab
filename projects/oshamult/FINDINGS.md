# oshamult findings

## Smoke (scored)

- Flipped after hours clear + dual **26/26** paper goldens
- Domain: `penalty.ts` + `penaltyB.ts` serial remaining-balance with `steps[]`
- Forecast API + four UI pages (honesty, catalog, detail, goldens)
- Digests: serial-penalty **workflow / method experiment**; no OIS parity claims

## CRUD (scored)

- Citation `PATCH` for analysts/admins; auditors **403** on create/patch
- Org member add; auditor can list + forecast (read path)
- Catalog/detail/honesty UI critical paths green

## Workflow (scored)

- Batch forecast independence (ok + reject siblings)
- Append-only audit + CSV export; auditor **403** on batch mutate
- Live `batch.html` + `audit.html`

## Integrate (scored)

- HMAC webhook ingest + idempotent replay
- Admin settings RBAC (auditor redacts secret / cannot PATCH)
- Catalog + audit pagination
- Live `settings.html`

## Scale (scored)

- Walk ≥250 citations with bounded pagination
- Rate limit **429** + Retry-After; concurrent batch independence
- `SCALE.md` documented; dual-impl holds

## Sustain (scored — product complete)

- All **7** blueprint pages live (catalog, detail, batch, audit, goldens, settings, honesty)
- Offline `try.html` with Kill A honesty (consultants still model; not OIS)
- Dual-impl + goldens browser + matrix floor
- **56** tests green
- Digests: serial-penalty forecast / method experiment only
