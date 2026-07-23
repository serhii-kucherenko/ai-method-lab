# Filing Penalty Desk — phased roadmap (architect draft)

**Display name:** Filing Penalty Desk · **Slug:** `filing-penalty-desk`  
**Paper only. Draft.** Do not open `projects/filing-penalty-desk/` yet. Do not brand as `irc6651`.

Maps A03/A10 phases to the comprehensive ladder. Sources: `filing-penalty-desk-COMPREHENSIVE-BLUEPRINT.md`, `filing-penalty-desk-PRD.md`, `filing-penalty-desk-VISION.md`, legacy `irc6651-algorithm.md` + fixtures.

**Hard rule:** UI critical paths that exist in a phase must stay green when later phases land. Smoke-as-sustain fails. Sustain requires **≥15 features**, **≥6 pages**, **≥4 aggregates**, and a best-practices **tutor guide**.

---

## smoke

| | |
|--|--|
| **Goal** | Port month-walk FTF/FTP engine + ≥25 paper goldens; org + return timeline + forecast aggregates exist without a full UI |
| **Pages unlocked** | None required (forecast API only). PRODUCT.md must carry Kill honesty: forecast ≠ IRS / CPA |
| **Exit criteria** | Paper fixtures green (or product-ported); dual-impl path planned; cheat rejects (flat fee, dual-approver, interest-as-penalty); mature display name in PRODUCT |
| **UI green** | N/A yet — do not ship a fake “sustain” calculator page |

---

## crud

| | |
|--|--|
| **Goal** | Org-scoped return catalog + timeline detail with RBAC; honesty page live early |
| **Pages unlocked** | (1) Returns catalog · (2) Timeline detail · (7) Honesty / disclaimer |
| **Exit criteria** | Analyst PATCH + POST forecast; auditor cannot mutate; catalog/detail/honesty critical paths green; tenancy + role basics |
| **UI green** | Catalog list/filter; detail forecast lock with separate FTF/FTP; honesty sentence in DOM |

---

## workflow

| | |
|--|--|
| **Goal** | Scenario compare (naive vs correct), batch independence, append-only audit + CSV |
| **Pages unlocked** | (3) Scenario compare · (4) Batch forecast · (5) Audit log |
| **Exit criteria** | Batch independence; audit CSV export; scenario page shows naive flat-fee vs month-walk dollars |
| **UI green** | Prior crud pages stay green; batch per-line results; audit lists forecast locks |

---

## integrate

| | |
|--|--|
| **Goal** | Inbound signed webhook + pagination/search + org settings + rate-limit feedback |
| **Pages unlocked** | (8) Org settings |
| **Exit criteria** | Webhook HMAC + idempotency; pagination on catalog/audit; admin-only settings; rate-limit headers/UX feedback |
| **UI green** | All prior pages stay green; settings shows tokens / webhook secret without leaking to auditor |

---

## scale

| | |
|--|--|
| **Goal** | Concurrent batch stress; rate limits documented; no dual-impl drift |
| **Pages unlocked** | No new pages — harden batch + API under load |
| **Exit criteria** | Concurrent stress green; fixtures + dual checkers still green |
| **UI green** | Full prior page set stays green under concurrent batch traffic |

---

## sustain

| | |
|--|--|
| **Goal** | Full comprehensive bar: all pages, goldens browser, dual-impl CI, offline try, in-app tutor guide link, matrix floor |
| **Pages unlocked** | (6) Goldens browser — completes the ≥6-page map (target 8) |
| **Exit criteria** | ≥15 features live; dual-impl CI green; offline try page; tutor guide under `docs/guides/`; digests use **Filing Penalty Desk** only; never claim IRS/CPA replacement |
| **UI green** | **All** page critical paths green; goldens vs live engine; honesty + Kill copy present; guide link in-app |

---

## Phase → page unlock (summary)

| Phase | Pages |
|-------|-------|
| smoke | — (API) |
| crud | Catalog, Timeline detail, Honesty |
| workflow | Scenario compare, Batch, Audit |
| integrate | Settings |
| scale | (harden) |
| sustain | Goldens (+ all prior) |

---

## Explicit fail

Shipping smoke (or a single late-fee page) as “sustain” fails `docs/COMPREHENSIVE_PRODUCT.md`. Branding the product `irc6651` fails `docs/PRODUCT_NAMING.md`.

## Explicit non-action

No product folder from this roadmap. No `ready_to_build` flip from this draft alone — wait for PM-GO + controller depth clearance.
