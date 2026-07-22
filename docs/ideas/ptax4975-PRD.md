# ptax4975 — product requirements (PRD)

**Paper only.** `current_idea` under hours hold. Do not open `projects/ptax4975/` until `FLIP_PATH_READY`.

Real PRD for activation — not a thin smoke brief. Sources: `ptax4975-VISION.md`, `ptax4975-PRODUCT-FRAMING.md`, `ptax4975-VALUE-STAKES.md`, `ptax4975-PAGE-SPECS.md`, `ptax4975-API-CONTRACT.md`, `ptax4975-ACCEPTANCE.md`, `ptax4975-algorithm.md`, `ptax4975-FMV-FENCE.md`, `ptax4975-TAXABLE-PERIOD-FENCE.md`.

---

## Problem

Plan sponsors forecast § 4975 prohibited-transaction excise as flat “15% once.” Statute shapes **15% × year-parts** for the first tier, then **100%** additional tax if uncorrected, with amount-involved / FMV rules under (f)(4). Spreadsheets that ignore year-parts invent cash that misses the tier shape.

Counsel and tax software already compute the tax (Kill A). This product is a **first-/second-tier excise-shape forecast honesty** workflow — not Form 5330 filing software.

---

## Personas

| Persona | Role enum | Needs |
|---------|-----------|-------|
| **Plan / fiduciary-tax analyst** | `analyst` | Enter PT facts, run excise forecast, batch PTs, see initial + additional separately |
| **Compliance auditor** | `auditor` | Read-only catalogs and forecasts; audit trail + goldens; export CSV; cannot PATCH transactions |
| **Org admin** | `admin` | Members, API tokens, webhook HMAC secret |
| **FP&A partner** (viewer via honesty + detail) | often auditor or analyst-read | Flat-once vs year-parts failure modes visible in dollars |

---

## Unique domain claim (must remain)

**15% × year-parts then 100% if uncorrected** (+ optional greater-of FMV on amount) — against golden fixtures. If year-parts or second-tier are missing, the product collapses to a flat once-excise clone. Not dual-signer, not Form 5330 filing, not highest-FMV-during-period as silent v0.

---

## User stories + acceptance criteria

### US-1 — Catalog prohibited transactions

**As** an analyst, **I want** a paginated list of PTs filtered by corrected flag and total exposure, **so that** I can find transactions that need excise-forecast attention.

**AC**

- Given org-scoped transactions, when I open `/orgs/:orgId/transactions`, then I see only that org’s rows.
- Filters for corrected / exposure change the result set.
- Unauthenticated requests return 401.
- Pagination works (integrate+).

### US-2 — Edit PT facts and run excise forecast

**As** an analyst, **I want** to edit amount / FMV pair / year-parts / corrected on a transaction, then POST forecast, **so that** I lock initial + additional + total with algorithm version.

**AC**

- PATCH `/orgs/:orgId/transactions/:id` succeeds for analyst; fails for auditor.
- POST `/orgs/:orgId/transactions/:id/forecast` returns `{ status: "ok", initial_tax, additional_tax, total, algorithm_version }` on valid inputs matching algorithm v0.
- Corrected two-year toy ($10,000 × 2) yields **initial 3000**, **additional 0**, **total 3000**.
- Same facts uncorrected yield **additional 10000**, **total 13000**.
- Detail UI shows initial and additional separately (not a single mystery “excise” number).

### US-3 — Reject flat-excise and dual-approver cheats

**As** the product, **I must** reject forecasts that use flat once-excise theater or dual-approver costumes, **so that** cheat theater cannot pass as a happy path.

**AC**

- `flat_excise_cheat=true` → 422.
- `dual_approver_cheat=true` → 422.
- UI never presents these as valid “final” forecasts.
- Honesty page contrasts year-parts **$3,000** vs flat-once **$1,500** miss on the corrected two-year toy.

### US-4 — Greater-of FMV and understate reject

**As** an analyst, **I want** optional greater-of FMV pair resolution with understate reject, **so that** understated amount vs max(FMV) cannot invent cash.

**AC**

- When `use_fmv_greater_of`, amount resolves to max(`fmv_a`, `fmv_b`) per algorithm v0.
- `understate_amount` with amount < greater-of → reject `greater_of_cheat` (or equivalent reason in fixtures).
- Digests never claim highest-FMV-during-period parity while v0 only does greater-of two inputs (`ptax4975-FMV-FENCE.md`).

### US-5 — Batch independent forecasts

**As** an analyst, **I want** to queue many PT ids on `/orgs/:orgId/batch/forecast`, **so that** transactions run without shared mutable mid-batch tax state.

**AC**

- Each PT run is independent; one failure does not rewrite siblings.
- No dual-approver gate appears in the batch UI.

### US-6 — Audit trail

**As** an auditor, **I want** append-only events for create, recalc, and cheat/gate rejects, **so that** I can explain who locked what.

**AC**

- GET `/orgs/:orgId/audit` filterable by org/transaction/actor/reject reason.
- Auditor/admin can export CSV; auditor cannot mutate transactions.
- Events are append-only (no silent edit of history).

### US-7 — Goldens browser

**As** an auditor, **I want** read-only cards for `docs/ideas/fixtures/ptax4975-*` vs the live engine, **so that** sustain proves unique-claim coverage.

**AC**

- GET `/orgs/:orgId/goldens` shows pass/fail vs live engine.
- ≥25 paper fixtures remain green in CI at sustain (day-1 scaffold targets ≥35).
- No mutate controls on this page.

### US-8 — Org settings and webhook

**As** an admin, **I want** members, roles, API tokens, and webhook HMAC secret, **so that** inbound PT pushes can land safely.

**AC**

- GET/PATCH `/orgs/:orgId/settings` admin-only.
- POST `/webhooks/transactions` requires valid HMAC; supports idempotency key.
- Replay with same idempotency key does not duplicate transactions.

### US-9 — Money honesty education

**As** any authenticated user, **I want** a static honesty page that states year-parts ≠ flat once, v0 greater-of ≠ highest-during-period, and Kill A still stands, **so that** digests cannot claim Form 5330 / IRS / DOL replacement.

**AC**

- Kill A sentence present in DOM: counsel and tax software still handle filing; forecast / method experiment.
- Flat-once and FMV-fence failure modes explained in dollars.
- Link to illustrative toys — not a live Form 5330.
- Forbidden copy absent: “files Form 5330”, “replaces IRS/DOL/counsel”, always flat 15% once.

---

## Out of scope (v1 / activation)

- Filing Form 5330; IRS / DOL / counsel replacement
- Silently matching highest-FMV-during-period without `ptax4975-v1` dual re-green
- Dual-approver status workflows
- Deriving year-parts from notice / assessment / correction dates as v0 happy path (caller supplies year_parts)
- Market proof from fixture pass counts
- OSHA / deposit-gap / lesser-of / drawback math (other seeds)

---

## Non-goals

1. Becoming the system of record for Form 5330 filing.
2. Winning commercially against counsel / tax software (Kill A stands).
3. Shipping smoke or a single flat-once calculator as sustain.
4. Claiming product-market demand from research goldens.
5. Noun-swapping dual-gate FSMs into “counsel approval boards.”

---

## Dependencies / fences (cite, do not weaken)

| Fence | Doc |
|-------|-----|
| Kill A | `ptax4975-VALUE-STAKES.md`, `ptax4975-PRODUCT-FRAMING.md` |
| Amount / FMV / taxable period | `ptax4975-FMV-FENCE.md` |
| Algorithm v0 | `ptax4975-algorithm.md` |
| API surface | `ptax4975-API-CONTRACT.md` — do not invent contradicting routes |
| Comprehensive bar | `docs/COMPREHENSIVE_PRODUCT.md` |

---

## Explicit non-action

Do not open `projects/ptax4975/` from this PRD until `FLIP_PATH_READY`.
