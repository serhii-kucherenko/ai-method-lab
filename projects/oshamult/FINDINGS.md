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
- **30** tests green

## Workflow (scored)

- Batch forecast independence (ok + reject siblings)
- Append-only audit + CSV export; auditor **403** on batch mutate
- Live `batch.html` + `audit.html`; prior pages stay green
- **31** tests green

## Next

Integrate: HMAC webhook + pagination + admin settings.
