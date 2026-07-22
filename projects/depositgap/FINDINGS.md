# depositgap — findings

## Smoke (2026-07-22)

- Opened after **htsroute park** (Challenge D value weak) under **hour** hold (not calendar day).
- Architect pack was already on file (VISION/ROADMAP/PRD/ERD).
- **26** tests green: 23 dual goldens + smoke API + UI critical (money honesty Kill A).
- Stack: Node/TS, SQLite, bearer auth; multi-page public shell (≥8 files), not one calculator.

## Crud (2026-07-22)

- GET `/orgs/:orgId/entries` (full list + optional `limit`/`offset`); GET/PATCH `/entries/:id`.
- Org creator is **admin**; `POST /orgs/:orgId/members` attaches auditor/analyst for RBAC tests.
- Auditor can list/get; **403** on PATCH. Analyst/admin mutate + forecast.
- `public/entries.html` loads list from API (token/orgId via query or localStorage).
- `public/entry-detail.html` shows fields + Run forecast → POST forecast.
- Money honesty page stays green; no ACE/broker replacement claims.
- **27** tests green (`npm test` + `npm run lint`).

## Honesty

Brokers/CBP still liquidate. Digests must say forecast experiment. § 6621 is an input rate (see seed fence).
