# depositgap — phased roadmap (seed paper)

**Paper only. Seed. Do not open `projects/depositgap/` yet.**

Maps A03/A10 phases to the comprehensive ladder. Sources: `depositgap-PHASE-BRIEFS.md`, `depositgap-PAGE-SPECS.md`, `depositgap-COMPREHENSIVE-BLUEPRINT.md`, `depositgap-SUSTAIN-TEST-MATRIX.md`, `depositgap-API-CONTRACT.md`.

**Hard rule:** UI critical paths that exist in a phase must stay green when later phases land. Smoke-as-sustain fails.

---

## smoke

| | |
|--|--|
| **Goal** | Port the deposit→assess→interest engine + ≥23 paper goldens; org + entry + forecast aggregates exist without a full UI |
| **Pages unlocked** | None required (forecast API only). PRODUCT.md must already carry Kill A forecast ≠ ACE language |
| **Exit criteria** | All `docs/ideas/fixtures/depositgap-*.json` green (or product-ported); dual-impl path planned; `skip_interest` rejects; Kill A in PRODUCT |
| **UI green** | N/A yet — do not ship a fake “sustain” calculator page |

---

## crud

| | |
|--|--|
| **Goal** | Org-scoped catalog + entry detail with RBAC; money honesty page live early |
| **Pages unlocked** | (1) Entries catalog `/orgs/:orgId/entries` · (2) Entry detail `/orgs/:orgId/entries/:id` · (8) Money honesty `/orgs/:orgId/honesty` (or public `/honesty`) |
| **Exit criteria** | Analyst PATCH + POST forecast; auditor cannot mutate; P-catalog, P-detail, P-honesty critical paths green; R- basics (tenancy + role) |
| **UI green** | Catalog list/filter, detail forecast lock (fixture A shape + non-zero interest when days > 0), honesty Kill A sentence in DOM |

---

## workflow

| | |
|--|--|
| **Goal** | Batch independence, POR cash rollup, append-only audit |
| **Pages unlocked** | (3) Batch forecast `/orgs/:orgId/batch` · (4) Interest & cash impact `/orgs/:orgId/cash-impact` · (5) Audit log `/orgs/:orgId/audit` |
| **Exit criteria** | P-batch, P-cash, P-audit; C- concurrency (independent true_ups; failures do not rewrite siblings); audit CSV export |
| **UI green** | Prior crud pages stay green; batch shows per-line results; cash impact shows signed refund for overdeposit; audit lists forecast locks |

---

## integrate

| | |
|--|--|
| **Goal** | Inbound signed webhook + pagination + org settings |
| **Pages unlocked** | (7) Org settings `/orgs/:orgId/settings` |
| **Exit criteria** | `POST /webhooks/entries` HMAC + idempotency (W- suite); pagination on catalog, cash-impact, audit (A-); admin-only settings PATCH; P-org |
| **UI green** | All prior pages stay green; settings shows tokens / webhook secret without leaking to auditor |

---

## scale

| | |
|--|--|
| **Goal** | Concurrent batch stress; rate limits documented; no dual-impl drift |
| **Pages unlocked** | No new pages — harden batch + API under load |
| **Exit criteria** | C- stress green; rate-limit docs; fixtures + dual checkers still green |
| **UI green** | Full prior page set stays green under concurrent batch traffic |

---

## sustain

| | |
|--|--|
| **Goal** | Full comprehensive bar: all 8 pages, goldens browser, dual-impl CI, offline try, matrix floor |
| **Pages unlocked** | (6) Goldens browser `/orgs/:orgId/goldens` — completes the 8-page map |
| **Exit criteria** | Sustain matrix ~≥60 (G/A/P/R/W/C/M/D); dual-impl CI green; offline `try.html`; digests include Kill A; never claim broker/CBP replacement; § 6621 stand-in honesty (`depositgap-6621-FENCE.md`) |
| **UI green** | **All eight** page critical paths green; goldens cards vs live engine; honesty + Kill A copy present |

---

## Phase → page unlock (summary)

| Phase | Pages |
|-------|-------|
| smoke | — (API) |
| crud | Catalog, Detail, Honesty |
| workflow | Batch, Cash impact, Audit |
| integrate | Settings |
| scale | (harden) |
| sustain | Goldens (+ all prior) |

---

## Explicit fail

Shipping smoke (or a single true-up page) as “sustain” fails `docs/COMPREHENSIVE_PRODUCT.md` and `depositgap-PHASE-BRIEFS.md`.

## Explicit non-action

No product folder from this roadmap. Activation: `depositgap-POST-HTSROUTE-RUN.md` after htsroute clears.
