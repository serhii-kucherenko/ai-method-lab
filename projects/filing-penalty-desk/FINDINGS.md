# Filing Penalty Desk findings

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
