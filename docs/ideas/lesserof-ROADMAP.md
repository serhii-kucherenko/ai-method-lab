# lesserof — phased roadmap (seed paper)

**Paper only. Seed / research. Do not open `projects/lesserof/` yet.**

Maps A03/A10 phases to the comprehensive ladder. Sources: `lesserof-PHASE-BRIEFS.md`, `lesserof-PAGE-SPECS.md`, `lesserof-COMPREHENSIVE-BLUEPRINT.md`, `lesserof-SUSTAIN-TEST-MATRIX.md`, `lesserof-API-CONTRACT.md`.

**Hard rule:** UI critical paths that exist in a phase must stay green when later phases land. Smoke-as-sustain fails.

---

## smoke

| | |
|--|--|
| **Goal** | Port the stacked TFTEA → USMCA + basket gate engine + ≥23 paper goldens; org + claim line aggregates exist without a full UI |
| **Pages unlocked** | None required (forecast API only). PRODUCT.md must already carry Kill A stacked-cap ≠ ACE language |
| **Exit criteria** | All `docs/ideas/fixtures/lesserof-*.json` green (or product-ported); dual-impl path planned; wrong-mode / basket / missing-partner rejects; Kill A in PRODUCT |
| **UI green** | N/A yet — do not ship a fake “sustain” ×0.99 calculator page |

---

## crud

| | |
|--|--|
| **Goal** | Org-scoped claim catalog + line detail with RBAC; money honesty page live early |
| **Pages unlocked** | (1) Claim workspace `/orgs/:orgId/claim-lines` · (2) Lane compare `/orgs/:orgId/claim-lines/:id/lane-compare` · (6) Money honesty `/orgs/:orgId/honesty` (or public `/honesty`) |
| **Exit criteria** | Analyst PATCH + POST forecast; auditor cannot mutate; P-workspace, P-lane, P-honesty critical paths green; R- basics (tenancy + role) |
| **UI green** | Catalog list/filter, detail stacked lock (fixture A/C shapes + USMCA $0 wipe visible), honesty Kill A sentence in DOM |

---

## workflow

| | |
|--|--|
| **Goal** | Batch independence, USMCA stack + basket pages, forecast-vs-actual, append-only audit |
| **Pages unlocked** | (3) USMCA stack `/orgs/:orgId/usmca` · (4) Basket eligibility `/orgs/:orgId/basket` · (5) Forecast vs actual `/orgs/:orgId/forecast-vs-actual` · Audit `/orgs/:orgId/audit` |
| **Exit criteria** | P-usmca, P-basket, P-forecast, P-audit; C- concurrency (independent caps; one reject does not rewrite siblings); audit CSV export |
| **UI green** | Prior crud pages stay green; USMCA shows TFTEA then partner cap to $0; basket shows reject ≠ silent lesser-of; forecast table shows fantasy-cash deltas |

---

## integrate

| | |
|--|--|
| **Goal** | Inbound signed webhook + pagination + org settings |
| **Pages unlocked** | (7) Org settings `/orgs/:orgId/settings` |
| **Exit criteria** | `POST /webhooks/claim-lines` HMAC + idempotency (W- suite); pagination on catalog + audit (A-); admin-only settings PATCH; P-org |
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
| **Goal** | Full comprehensive bar: all blueprint pages, goldens browser, dual-impl CI, offline try, matrix floor |
| **Pages unlocked** | Goldens browser `/orgs/:orgId/goldens` — completes the page map |
| **Exit criteria** | Sustain matrix floor (G/A/P/R/W/C/M/D); dual-impl CI green; offline `try.html` with USMCA wipe toy; digests include Kill A; never claim broker/ACE replacement; USMCA wipe fence honesty (`lesserof-USMCA-WIPE-FENCE.md`) |
| **UI green** | **All** page critical paths green; goldens cards vs live engine; honesty + Kill A copy present |

---

## Phase → page unlock (summary)

| Phase | Pages |
|-------|-------|
| smoke | — (API) |
| crud | Workspace, Lane compare, Honesty |
| workflow | USMCA stack, Basket, Forecast vs actual, Audit |
| integrate | Settings |
| scale | (harden) |
| sustain | Goldens (+ all prior) |

---

## Explicit fail

Shipping smoke (or a single “99% of paid” page) as “sustain” fails `docs/COMPREHENSIVE_PRODUCT.md` and `lesserof-PHASE-BRIEFS.md`.

## Explicit non-action

No product folder from this roadmap. Still blocked from build until hours + ticks clear (`lesserof-POST-DEPOSITGAP-STATUS.md`).
