# oshamult — phased roadmap (active research)

**Paper only during hours hold. Do not open `projects/oshamult/` until preflip clears.**  
**`current_idea` = oshamult** — wait on ≥4h framing + `oshamult-PREFLIP-CHECKLIST.md`.

Maps A03/A10 phases to the comprehensive ladder. Sources: `oshamult-PHASE-BRIEFS.md`, `oshamult-PAGE-SPECS.md`, `oshamult-COMPREHENSIVE-BLUEPRINT.md`, `oshamult-SUSTAIN-TEST-MATRIX.md`, `oshamult-API-CONTRACT.md`, `oshamult-SERIAL-FENCE.md`.

**Hard rule:** UI critical paths that exist in a phase must stay green when later phases land. Smoke-as-sustain fails.

---

## smoke

| | |
|--|--|
| **Goal** | Port the serial GBP → Size→History→Good Faith→Quick Fix engine + **≥25** paper goldens; org + citation aggregates exist without a full UI |
| **Pages unlocked** | None required (forecast API only). PRODUCT.md must already carry Kill A serial ≠ OIS / ≠ additive language |
| **Exit criteria** | All `docs/ideas/fixtures/oshamult-*.json` green (or product-ported); dual-impl path planned; statutory-max / additive / classification rejects; Kill A in PRODUCT |
| **UI green** | N/A yet — do not ship a fake “sustain” discount-calculator page |

---

## crud

| | |
|--|--|
| **Goal** | Org-scoped citations catalog + citation detail with RBAC; money honesty page live early |
| **Pages unlocked** | (1) Citations catalog `/orgs/:orgId/citations` · (2) Citation detail `/orgs/:orgId/citations/:id` · (7) Money honesty `/orgs/:orgId/honesty` (or public `/honesty`) |
| **Exit criteria** | Analyst PATCH + POST forecast; auditor cannot mutate; catalog/detail/honesty critical paths green; R- basics (tenancy + role) |
| **UI green** | Catalog list/filter; detail shows each serial step (fixture A / N shapes); honesty Kill A sentence in DOM |

---

## workflow

| | |
|--|--|
| **Goal** | Batch independence + append-only audit |
| **Pages unlocked** | (3) Batch forecast `/orgs/:orgId/batch` · (4) Audit log `/orgs/:orgId/audit` |
| **Exit criteria** | Batch POST independent citation runs; one reject does not rewrite siblings; audit CSV export; concurrency note green |
| **UI green** | Prior crud pages stay green; batch shows per-citation ok/reject; audit filterable |

---

## integrate

| | |
|--|--|
| **Goal** | Inbound signed webhook + pagination + org settings |
| **Pages unlocked** | (6) Org settings `/orgs/:orgId/settings` |
| **Exit criteria** | `POST /webhooks/citations` HMAC + idempotency; pagination on catalog + audit; admin-only settings PATCH |
| **UI green** | All prior pages stay green; settings shows tokens / webhook secret without leaking to auditor |

---

## scale

| | |
|--|--|
| **Goal** | Concurrent batch stress; rate limits documented; no dual-impl drift |
| **Pages unlocked** | No new pages — harden batch + API under load |
| **Exit criteria** | Concurrent independent citations green; rate-limit docs; fixtures + dual checkers still green |
| **UI green** | Full prior page set stays green under concurrent batch traffic |

---

## sustain

| | |
|--|--|
| **Goal** | Full comprehensive bar: all blueprint pages, goldens browser, dual-impl CI, offline try, matrix floor |
| **Pages unlocked** | (5) Goldens browser `/orgs/:orgId/goldens` — completes the page map |
| **Exit criteria** | Sustain matrix floor; dual-impl CI green; offline `try.html` with serial vs additive miss; digests include Kill A; never claim OIS/counsel replacement; serial fence honesty (`oshamult-SERIAL-FENCE.md`, `oshamult-SIZE-TABLE.md`) |
| **UI green** | **All** page critical paths green; goldens cards vs live engine; honesty + Kill A copy present |

---

## Phase → page unlock (summary)

| Phase | Pages |
|-------|-------|
| smoke | — (API) |
| crud | Catalog, Citation detail, Honesty |
| workflow | Batch, Audit |
| integrate | Settings |
| scale | (harden) |
| sustain | Goldens (+ all prior) |

---

## Explicit fail

Shipping smoke (or a single “sum the %” / statutory-max calculator page) as “sustain” fails `docs/COMPREHENSIVE_PRODUCT.md` and `oshamult-PHASE-BRIEFS.md`.

## Explicit non-action

No product folder from this roadmap. Flip only after hours + `oshamult-FLIP-WHEN-CLEAR.md` / `oshamult-DAY1-COMMIT-ORDER.md`.
