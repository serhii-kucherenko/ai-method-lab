# ptax4975 — phased roadmap (seed paper)

**Paper only. Parallel seed. Do not open `projects/ptax4975/` until activation queue clears.**  
**Do not set `current_idea` to ptax4975** — `oshamult` holds the research slot.

Maps A03/A10 phases to the comprehensive ladder. Sources: `ptax4975-PHASE-BRIEFS.md`, `ptax4975-PAGE-SPECS.md`, `ptax4975-COMPREHENSIVE-BLUEPRINT.md`, `ptax4975-SUSTAIN-TEST-MATRIX.md`, `ptax4975-API-CONTRACT.md`, `ptax4975-FMV-FENCE.md`, `ptax4975-REPO-SCAFFOLD.md`.

**Hard rule:** UI critical paths that exist in a phase must stay green when later phases land. Smoke-as-sustain fails.

---

## smoke

| | |
|--|--|
| **Goal** | Port the 15% × year-parts + 100% if uncorrected engine (+ optional greater-of FMV) + **≥25** paper goldens (day-1 target ≥35); org + PT aggregates exist without a full UI |
| **Pages unlocked** | None required (forecast API only). PRODUCT.md must already carry Kill A Form 5330 / counsel language + FMV fence honesty |
| **Exit criteria** | All `docs/ideas/fixtures/ptax4975-*.json` green (or product-ported); dual-impl path planned; flat-excise / dual-approver / understate rejects; Kill A in PRODUCT |
| **UI green** | N/A yet — do not ship a fake “sustain” flat-once calculator page |

---

## crud

| | |
|--|--|
| **Goal** | Org-scoped transactions catalog + transaction detail with RBAC; money honesty page live early |
| **Pages unlocked** | (1) Transactions catalog `/orgs/:orgId/transactions` · (2) Transaction detail `/orgs/:orgId/transactions/:id` · (6) Money honesty `/orgs/:orgId/honesty` (or public `/honesty`) |
| **Exit criteria** | Analyst PATCH + POST forecast; auditor cannot mutate; catalog/detail/honesty critical paths green; R- basics (tenancy + role) |
| **UI green** | Catalog list/filter by corrected / exposure; detail shows initial + additional + total (fixture A / uncorrected shapes); honesty Kill A + FMV fence sentence in DOM |

---

## workflow

| | |
|--|--|
| **Goal** | Batch independence + append-only audit |
| **Pages unlocked** | (3) Batch forecast `/orgs/:orgId/batch` · (4) Audit log `/orgs/:orgId/audit` |
| **Exit criteria** | Batch POST independent PT runs; one reject does not rewrite siblings; audit CSV export; concurrency note green |
| **UI green** | Prior crud pages stay green; batch shows per-PT ok/reject; audit filterable |

---

## integrate

| | |
|--|--|
| **Goal** | Inbound signed webhook + pagination + org settings |
| **Pages unlocked** | (7) Org settings `/orgs/:orgId/settings` |
| **Exit criteria** | `POST /webhooks/transactions` HMAC + idempotency; pagination on catalog + audit; admin-only settings PATCH |
| **UI green** | All prior pages stay green; settings shows tokens / webhook secret without leaking to auditor |

---

## scale

| | |
|--|--|
| **Goal** | Concurrent batch stress; rate limits documented; no dual-impl drift |
| **Pages unlocked** | No new pages — harden batch + API under load |
| **Exit criteria** | Concurrent independent PTs green; rate-limit docs; fixtures + dual checkers still green |
| **UI green** | Full prior page set stays green under concurrent batch traffic |

---

## sustain

| | |
|--|--|
| **Goal** | Full comprehensive bar: all blueprint pages, goldens browser, dual-impl CI, offline try, matrix floor |
| **Pages unlocked** | (5) Goldens browser `/orgs/:orgId/goldens` — completes the page map |
| **Exit criteria** | Sustain matrix floor; dual-impl CI green; offline `try.html` with flat-once vs year-parts miss; digests include Kill A; never claim Form 5330 / IRS / DOL replacement; FMV fence honesty (`ptax4975-FMV-FENCE.md`) |
| **UI green** | **All** page critical paths green; goldens cards vs live engine; honesty + Kill A + FMV fence copy present |

---

## Phase → page unlock (summary)

| Phase | Pages |
|-------|-------|
| smoke | — (API) |
| crud | Catalog, Transaction detail, Honesty |
| workflow | Batch, Audit |
| integrate | Settings |
| scale | (harden) |
| sustain | Goldens (+ all prior) |

---

## Explicit fail

Shipping smoke (or a single “15% once” calculator page) as “sustain” fails `docs/COMPREHENSIVE_PRODUCT.md` and `ptax4975-PHASE-BRIEFS.md`.

## Explicit non-action

No product folder from this roadmap. Do not flip `current_idea` to ptax4975 while oshamult holds the research slot (`ptax4975-POST-OSHAMULT-RUN.md`).
