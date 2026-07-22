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

## Workflow (2026-07-22)

- `POST /orgs/:orgId/batch/forecast` with `{ entryIds }` — independent true-ups; sibling failures do not rewrite good lines.
- `GET /orgs/:orgId/cash-impact` — POR rollup of duty_delta + interest + true_up from each entry’s latest ok forecast (fixture A shape: 150000 / 12000 / 162000).
- `GET /orgs/:orgId/audit` — forecast locks/rejects; auditor can read; `?format=csv` export.
- Live pages: `batch.html`, `cash-impact.html`, `audit.html` (token/org via query or localStorage).
- UI critical covers batch/cash/audit live markers; prior catalog/detail/honesty stay green.
- **28** tests green (`npm test` + `npm run lint`). Next: integrate (webhook + pagination + settings).

## Integrate (2026-07-22)

- `POST /webhooks/entries` — HMAC SHA-256 (`x-signature`); bad sig → 401; `idempotency-key` replay returns same entry.
- Org settings `GET/PATCH /orgs/:orgId/settings` — webhook secret + tokens note; PATCH admin-only; auditor GET redacted.
- Pagination: catalog (prior), cash-impact POR lines, audit events all support `limit`/`offset`.
- `public/settings.html` loads/saves settings (token/org via query or localStorage); rotate secret supported.
- UI critical includes settings live marker. **31** tests green. Next: scale (stress + rate limits).

## Scale (2026-07-22)

- Catalog default `limit` 20 / hard cap 100; ≥250-entry page walk without gaps or dupes.
- Concurrent overlapping `batch/forecast` calls stay independent per entry.
- Rate limit returns 429 + `Retry-After`. Notes in `SCALE.md` (O(page) lists).
- Documented pagination bounds and batch independence.
- **33** tests green. Next was sustain.

## Sustain (2026-07-22)

- All **8** pages live (catalog, detail, batch, cash-impact, audit, goldens, settings, money honesty) — no “Phase unlock later” stubs.
- `GET /orgs/:orgId/goldens` read-only fixture cards vs live engine; `public/goldens.html` browser.
- Offline `try.html`: deposit→assessed→interest with duty_delta + interest + true_up; Kill A disclaimer; skip-interest cheat rejects.
- Sustain matrix themes covered in `test/sustain.test.ts`; dual-impl fixtures stay green.
- UI critical asserts all 8 pages load with live content markers.
- **76** tests green (`npm test` + `npm run lint`). Portfolio → sustained.
- Honesty: brokers/CBP still liquidate; no ACE replacement claims; digests must say forecast / method experiment.

## Honesty

Brokers/CBP still liquidate. Digests must say forecast experiment. § 6621 is an input rate (see seed fence).
