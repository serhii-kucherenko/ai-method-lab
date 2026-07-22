# depositgap — product requirements (seed PRD)

**Paper only. Seed. Do not open `projects/depositgap/` yet.**

Real PRD for activation later — not a thin smoke brief. Sources: `depositgap-VISION.md`, `depositgap-PRODUCT-FRAMING.md`, `depositgap-VALUE-STAKES.md`, `depositgap-PAGE-SPECS.md`, `depositgap-API-CONTRACT.md`, `depositgap-ACCEPTANCE.md`, `depositgap-algorithm.md`, `depositgap-6621-FENCE.md`.

---

## Problem

AD/CVD importers pay a **cash deposit** at entry. Final **assessed** rates at liquidation often differ. Statute requires collecting or refunding the difference **with** 19 U.S.C. § 1677g interest (IRC § 6621). Teams that treat deposit as final COGS understate cash risk until the bill or refund lands.

Brokers and CBP already liquidate (Kill A). This product is a **forecast / FP&A honesty** workflow — not liquidation software.

---

## Personas

| Persona | Role enum | Needs |
|---------|-----------|-------|
| **Trade analyst** | `analyst` | Enter deposit/assessed facts, choose rate class, run forecast, batch POR lines, see cash impact |
| **Compliance auditor** | `auditor` | Read-only catalogs and forecasts; audit trail + goldens; export CSV; cannot PATCH entries or “finalize” |
| **Org admin** | `admin` | Members, API tokens, webhook HMAC secret |
| **FP&A partner** (viewer via honesty + cash impact) | often auditor or analyst-read | Duty delta + interest separated; POR rollups for planning |

---

## Unique domain claim (must remain)

`duty_delta = (assessed_rate − deposit_rate) × entered_value`, then § 1677g interest over publication→liquidation using an explicit rate input — with **rate_class** (`exporter_specific` \| `all_others` \| `other`) as a required assignment, never invented by the engine.

---

## User stories + acceptance criteria

### US-1 — Catalog entries

**As** an analyst, **I want** a paginated list of entries filtered by POR, order type (AD/CVD), rate class, bill/refund sign, and forecast status, **so that** I can find lines that need true-up attention.

**AC**

- Given org-scoped entries, when I open `/orgs/:orgId/entries`, then I see only that org’s rows.
- Filters for POR, `order_type`, rate class, sign, forecast status change the result set.
- Unauthenticated requests return 401.
- Pagination works (integrate+).

### US-2 — Edit deposit facts and run forecast

**As** an analyst, **I want** to edit deposit rate, assessed rate, entered value, publication/liquidation dates, interest rate, and rate class on an entry, then POST forecast, **so that** I lock a money line with duty_delta, days, interest, true_up, and algorithm version.

**AC**

- PATCH `/orgs/:orgId/entries/:id` succeeds for analyst; fails for auditor.
- POST `/orgs/:orgId/entries/:id/forecast` returns `{ status: "ok", duty_delta, days, interest, true_up, algorithm_version }` on valid inputs matching algorithm v0.
- Underdeposit toy (10%→25% on $1M) yields duty_delta **150000** before interest; interest non-zero when days > 0.
- Overdeposit yields signed negative duty_delta / true_up path visible.
- Engine never invents assessed rates — missing/invalid inputs reject.

### US-3 — Reject interest cheats

**As** the product, **I must** reject forecasts that skip interest when the window has days, **so that** deposit-as-final theater cannot pass.

**AC**

- `skip_interest=true` with `days > 0` → 422 / `{ status: "reject", ... }` (fixtures C, R).
- Zero/non-positive entered value, negative rates, missing interest rate, inverted dates → reject (ACCEPTANCE §B).
- UI never presents skip-interest as a valid “final” forecast.

### US-4 — Rate-class discipline

**As** an analyst, **I want** to choose `exporter_specific` vs `all_others` vs `other`, **so that** assessment class is an explicit input.

**AC**

- Rate class is required on forecast inputs; ambiguous/cheating enums rejected.
- Changing rate class is audited.
- All-others fixture (F) and exporter-specific paths remain distinguishable in goldens.

### US-5 — Batch independent forecasts

**As** an analyst, **I want** to queue many entry ids on `/orgs/:orgId/batch/forecast`, **so that** POR lines true-up without shared mutable mid-batch rate state.

**AC**

- Each entry run is independent; one failure does not rewrite siblings.
- Two entries → two independent true_ups (concurrency note Y).
- No dual-approver gate appears in the batch UI.

### US-6 — Cash impact rollup

**As** an analyst or auditor, **I want** POR rollups of duty_delta, interest, and true_up on `/orgs/:orgId/cash-impact`, **so that** finance sees net collect/refund before cash hits.

**AC**

- Sums match locked forecasts for the filter set.
- Signed refund path visible for overdeposit.
- Duty and interest remain separately labeled (never collapsed into one mystery number without breakdown).
- CSV export available.

### US-7 — Audit trail

**As** an auditor, **I want** append-only events for create, rate-class change, forecast lock, and override reject, **so that** I can explain who locked what.

**AC**

- GET `/orgs/:orgId/audit` filterable by org/entry/actor/rate-class.
- Auditor/admin can export CSV; auditor cannot mutate entries.
- Events are append-only (no silent edit of history).

### US-8 — Goldens browser

**As** an auditor, **I want** read-only cards for `docs/ideas/fixtures/depositgap-*` vs the live engine, **so that** sustain proves unique-claim coverage.

**AC**

- GET `/orgs/:orgId/goldens` shows pass/fail vs live engine.
- ≥23 paper fixtures remain green in CI at sustain.
- No mutate controls on this page.

### US-9 — Org settings and webhook

**As** an admin, **I want** members, roles, API tokens, and webhook HMAC secret, **so that** inbound ACE-ish deposit pushes can land safely.

**AC**

- GET/PATCH `/orgs/:orgId/settings` admin-only.
- POST `/webhooks/entries` requires valid HMAC; supports idempotency key.
- Replay with same idempotency key does not duplicate entries.

### US-10 — Money honesty education

**As** any authenticated user, **I want** a static honesty page that states deposit ≠ final and interest compounds the miss, **so that** digests cannot claim broker replacement.

**AC**

- Kill A sentence present in DOM: brokers and CBP still own liquidation; forecast / method experiment.
- § 1677g interest called out; § 6621 rate labeled stand-in per `depositgap-6621-FENCE.md`.
- Link to illustrative $150k + interest toy — not a live liquidation.
- Forbidden copy absent: “replaces broker/ACE”, “prints the bill”, deposit-as-final COGS.

---

## Out of scope (v1 / activation)

- Filing entries, protests, scope rulings, or Form 7501 replacement
- CBP day-count / OIS / ACE bill parity (calendar toy + single-rate stand-in only)
- Mid-window § 6621 rate segmentation (later dual-suite; fence stays open)
- Post-liquidation delinquency interest (§ 1505(d))
- Inventing assessed rates from public notices without human input
- Dual-approver status workflows
- Drawback / lesser-of-two refund math (§ 1313(l) — lesserof)
- Market proof from fixture pass counts

---

## Non-goals

1. Becoming the system of record for liquidation.
2. Winning commercially against brokers (Kill A stands).
3. Shipping smoke or a single calculator as sustain.
4. Claiming product-market demand from research goldens.
5. Noun-swapping dual-gate FSMs into “deposit status boards.”

---

## Dependencies / fences (cite, do not weaken)

| Fence | Doc |
|-------|-----|
| Kill A | `depositgap-VALUE-STAKES.md`, `depositgap-PRODUCT-FRAMING.md` |
| Day-count / delinquency | `depositgap-DAY-COUNT.md` |
| § 6621 mid-window | `depositgap-6621-FENCE.md` |
| Algorithm v0 | `depositgap-algorithm.md` |
| API surface | `depositgap-API-CONTRACT.md` — do not invent contradicting routes |
| Comprehensive bar | `docs/COMPREHENSIVE_PRODUCT.md` |

---

## Explicit non-action

Do not open `projects/depositgap/` from this PRD. Activation sheet: `depositgap-POST-HTSROUTE-RUN.md`.
