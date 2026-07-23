# Filing Penalty Desk findings

## Integrate (2026-07-23)

- Inbound webhook HMAC (`x-fpd-signature`) + idempotency replay
- Org settings: admin sees secret; auditor redacted; rotate admin-only
- Catalog pagination + label search; settings page live
- Cell: `A03__P-integrate-001__filing-penalty-desk__r1`
- Next: **scale** (concurrent batch, 429, dual-impl walk)

## Workflow (2026-07-23)

- Scenario compare: naive stacked flat fee vs month-walk dollars
- Batch forecast with per-line independence (ok / zero / reject siblings)
- Append-only audit + CSV export
- Pages: scenario, batch, audit (prior crud pages stay green)
- Cell: `A03__P-workflow-001__filing-penalty-desk__r1`
- Next: **integrate** (HMAC webhook, settings, pagination)

## Crud (2026-07-23)

- Returns catalog, timeline detail, honesty pages
- RBAC: auditor can list/read; cannot create/patch/forecast
- Separate FTF / FTP on forecast lock; no statute-code brand in UI
- Cell: `A03__P-crud-001__filing-penalty-desk__r1`
- Next: **workflow** (scenario compare, batch, audit CSV)

## Smoke (2026-07-23)

- Opened `projects/filing-penalty-desk/` under A03
- Ported **25** paper goldens (A–Y) with dual-impl month-walk (A + B)
- Forecast API: org → return timeline → locked FTF / FTP / combined
- Cheat rejects green; PRODUCT carries Kill A + mature display name
- Cell: `A03__P-smoke-001__filing-penalty-desk__r1`
