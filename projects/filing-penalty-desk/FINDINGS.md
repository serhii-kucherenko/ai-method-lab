# Filing Penalty Desk findings

## Sustain (2026-07-23)

- 8 pages live with UI critical paths; 18 features claimed; ≥4 aggregates
- Goldens browser ≥25 all_pass; dual-impl CI; offline `try.html`
- Tutor guide: `docs/guides/04-filing-penalty-desk-lessons.md`
- Maturity checklist in PRODUCT.md
- Cell: `A03__P-sustain-001__filing-penalty-desk__r1`
- CONTROLLER: `notify.product_complete_pending=true` (parent may send email)

## Scale (2026-07-23)

- Walk 250 timelines with paginated catalog (limit capped at 100)
- Concurrent batch forecasts stay independent and green
- Rate limit 429 + Retry-After documented in SCALE.md
- Dual-impl A/B still agree on same-month toy
- Cell: `A03__P-scale-001__filing-penalty-desk__r1`
- Next: **sustain** (goldens page, try.html, ≥15 features, tutor guide)

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
