# lesserof — product requirements (seed PRD)

**Paper only. Seed / research. Do not open `projects/lesserof/` yet.**

Real PRD for activation later — not a thin smoke brief. Sources: `lesserof-VISION.md`, `lesserof-PRODUCT-FRAMING.md`, `lesserof-VALUE-STAKES.md`, `lesserof-PAGE-SPECS.md`, `lesserof-API-CONTRACT.md`, `lesserof-ACCEPTANCE.md`, `lesserof-algorithm.md`, `lesserof-USMCA-WIPE-FENCE.md`.

---

## Problem

Export manufacturers forecast drawback refunds as “99% of duty paid.” For **substitution** claims, TFTEA **lesser-of** and (when exporting to Canada/Mexico) **USMCA** export lesser-of can cut recoverable duty — sometimes to **zero**. Basket “other” HTS lines are **ineligible** without a matching non-other 10-digit. Direct-ID lines must **not** take lesser-of. Finance invents cash that never comes.

Brokers and ACE filers already claim (Kill A). This product is a **stacked-cap forecast / method honesty** workflow — not filing software.

---

## Personas

| Persona | Role enum | Needs |
|---------|-----------|-------|
| **Trade analyst** | `analyst` | Enter claim-line facts, choose claim basis, run stacked forecast, batch lines, see TFTEA vs USMCA caps |
| **Compliance auditor** | `auditor` | Read-only catalogs and forecasts; audit trail + goldens; export CSV; cannot PATCH lines or “finalize” |
| **Org admin** | `admin` | Members, API tokens, webhook HMAC secret |
| **FP&A partner** (viewer via honesty + forecast-vs-actual) | often auditor or analyst-read | Naive / TFTEA-only / stacked deltas; USMCA wipe visible |

---

## Unique domain claim (must remain)

Stacked **TFTEA lesser-of** + **USMCA lesser-of** + **basket-“other” eligibility** + **direct-ID exemption** on drawback claim lines — against golden fixtures. If any of the four is missing, the product collapses to a vendor-blog ×0.99 clone.

---

## User stories + acceptance criteria

### US-1 — Catalog claim lines

**As** an analyst, **I want** a paginated list of claim lines filtered by claim basis, export destination, basket status, and forecast status, **so that** I can find lines that need stacked-cap attention.

**AC**

- Given org-scoped lines, when I open `/orgs/:orgId/claim-lines`, then I see only that org’s rows.
- Filters for `claim_basis`, destination, basket flag, forecast status change the result set.
- Unauthenticated requests return 401.
- Pagination works (integrate+).

### US-2 — Edit claim facts and run stacked forecast

**As** an analyst, **I want** to edit claim basis, duty columns, HTS8/HTS10, destination, and USMCA partner duty on a line, then POST forecast, **so that** I lock a money line with tftea_cap, usmca_cap, recoverable, and algorithm version.

**AC**

- PATCH `/orgs/:orgId/claim-lines/:id` succeeds for analyst; fails for auditor.
- POST `/orgs/:orgId/claim-lines/:id/forecast` returns `{ status: "ok", tftea_cap, usmca_cap, recoverable, algorithm_version }` on valid inputs matching algorithm v0.
- Substitution bind toy ($10k paid / $4k substitute) yields recoverable **3960** before USMCA; Canada duty-free then yields **0**.
- Engine never invents partner duty — missing USMCA partner with CA/MX destination rejects.

### US-3 — Reject mode and eligibility cheats

**As** the product, **I must** reject forecasts that apply lesser-of to direct-ID, skip lesser-of on substitution, relabel claim type, flag USMCA without partner duty, or flag USMCA on direct-ID, **so that** wrong-mode theater cannot pass.

**AC**

- Force lesser-of on direct-ID → 422 (fixture H).
- Skip lesser-of on substitution → 422 (fixture I).
- Relabel cheat → 422 (fixture K).
- USMCA without partner → 422 (fixture Q); USMCA on direct-ID → 422 (fixture V).
- UI never presents these as valid “final” forecasts.

### US-4 — Direct-ID exemption

**As** an analyst, **I want** direct-ID lines to recover 99% of paid **without** TFTEA lesser-of, **so that** lane compare proves the exemption.

**AC**

- Direct-ID forecast recovers `0.99 * us_duty_paid` (fixture B).
- Lane-compare GET shows direct-ID vs substitution on shared paid amount side by side.
- Applying lesser-of to direct-ID is reject, not a happy path.

### US-5 — USMCA wipe path

**As** an analyst, **I want** the USMCA stack page to show TFTEA then partner lesser-of, including duty-free → recoverable **$0**, **so that** finance cannot forget the second cap.

**AC**

- Canada/Mexico duty-free → `usmca_cap` = 0, `recoverable` = 0 (fixture C; `lesserof-USMCA-WIPE-FENCE.md`).
- Mid-cap partner binds between 0 and TFTEA (fixture M).
- TFTEA and USMCA caps remain separately labeled (never collapsed into one mystery number without breakdown).

### US-6 — Basket “other” eligibility

**As** an analyst, **I want** 8-digit “other” substitution to reject without a matching non-other HTS10, **so that** silent basket match cannot invent lesser-of cash.

**AC**

- Basket other without match → `{ status: "reject", reason: ... }` (fixture D) — **ineligible**, not silent $0 lesser-of.
- Matching non-other 10-digit → eligible then TFTEA (fixture J).
- Basket UI contrasts reject vs eligible.

### US-7 — Batch independent forecasts

**As** an analyst, **I want** to queue many line ids on `/orgs/:orgId/batch/forecast`, **so that** claim lines stack without shared mutable mid-batch cap state.

**AC**

- Each line run is independent; one failure does not rewrite siblings.
- Two lines → two independent caps (fixture L / concurrency note).
- No dual-approver gate appears in the batch UI.

### US-8 — Forecast vs actual report

**As** an analyst or auditor, **I want** naive / TFTEA-only / stacked / reject deltas on `/orgs/:orgId/forecast-vs-actual`, **so that** fantasy-cash misses are visible in dollars.

**AC**

- Table includes illustrative +$5,940 / +$3,960 / +$9,900 shapes when fixtures apply — labeled forecast toys.
- Signed / zero USMCA wipe path visible.
- CSV export available where contract requires.

### US-9 — Audit trail

**As** an auditor, **I want** append-only events for create, recalc, mode reject, eligibility reject, and override deny, **so that** I can explain who locked what.

**AC**

- GET `/orgs/:orgId/audit` filterable by org/line/actor/reject reason.
- Auditor/admin can export CSV; auditor cannot mutate lines.
- Events are append-only (no silent edit of history).

### US-10 — Goldens browser

**As** an auditor, **I want** read-only cards for `docs/ideas/fixtures/lesserof-*` vs the live engine, **so that** sustain proves unique-claim coverage.

**AC**

- GET `/orgs/:orgId/goldens` shows pass/fail vs live engine.
- ≥23 paper fixtures remain green in CI at sustain.
- No mutate controls on this page.

### US-11 — Org settings and webhook

**As** an admin, **I want** members, roles, API tokens, and webhook HMAC secret, **so that** inbound ERP claim-line pushes can land safely.

**AC**

- GET/PATCH `/orgs/:orgId/settings` admin-only.
- POST `/webhooks/claim-lines` requires valid HMAC; supports idempotency key.
- Replay with same idempotency key does not duplicate lines.

### US-12 — Money honesty education

**As** any authenticated user, **I want** a static honesty page that states stacked caps can wipe to $0 and Kill A still stands, **so that** digests cannot claim ACE replacement.

**AC**

- Kill A sentence present in DOM: brokers and ACE filers still file; stacked-cap workflow experiment.
- USMCA wipe called out; “99% of paid” failure mode explained in dollars.
- Link to illustrative fantasy-cash toys — not a live filed claim.
- Forbidden copy absent: “replaces ACE/broker”, “files the claim”, always ×0.99.

---

## Out of scope (v1 / activation)

- Filing drawback claims, ACE transmission, or Form 7551 replacement
- Same-condition § 182.45(b) as a silent default (separate golden lane later if dual-suite expands)
- Inventing USMCA partner duty without human input
- Dual-approver status workflows
- AD/CVD deposit↔assessed + § 1677g interest (depositgap)
- Market proof from fixture pass counts

---

## Non-goals

1. Becoming the system of record for drawback filing.
2. Winning commercially against brokers (Kill A stands).
3. Shipping smoke or a single ×0.99 calculator as sustain.
4. Claiming product-market demand from research goldens.
5. Noun-swapping dual-gate FSMs into “refund status boards.”

---

## Dependencies / fences (cite, do not weaken)

| Fence | Doc |
|-------|-----|
| Kill A | `lesserof-VALUE-STAKES.md`, `lesserof-PRODUCT-FRAMING.md` |
| USMCA wipe | `lesserof-USMCA-WIPE-FENCE.md` |
| Algorithm v0 | `lesserof-algorithm.md` |
| API surface | `lesserof-API-CONTRACT.md` — do not invent contradicting routes |
| Comprehensive bar | `docs/COMPREHENSIVE_PRODUCT.md` |

---

## Explicit non-action

Do not open `projects/lesserof/` from this PRD. Still **not** `ready_to_build` until hours + ticks clear (`lesserof-POST-DEPOSITGAP-STATUS.md`).
