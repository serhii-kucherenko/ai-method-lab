# oshamult — product requirements (seed PRD)

**Paper only. Parallel seed. Do not open `projects/oshamult/` until activation queue clears.**  
**Do not set `current_idea` to oshamult** — `lesserof` holds the research slot (hours hold).

Real PRD for activation later — not a thin smoke brief. Sources: `oshamult-VISION.md`, `oshamult-PRODUCT-FRAMING.md`, `oshamult-VALUE-STAKES.md`, `oshamult-PAGE-SPECS.md`, `oshamult-API-CONTRACT.md`, `oshamult-ACCEPTANCE.md`, `oshamult-algorithm.md`, `oshamult-SERIAL-FENCE.md`, `oshamult-SIZE-TABLE.md`.

---

## Problem

Employers forecast OSHA **proposed** civil penalties from statutory maximum or additive percentage stacks. FOM Ch. 6 starts from **GBP** and applies reductions **serially on the remaining balance**, with **classification gates** that block size / good faith / Quick Fix for willful, repeat, FTA, and (for Quick Fix) high-gravity serious. Spreadsheets that “sum the discounts” invent a proposed number that misses serial math.

Consultants and counsel already model penalties (Kill A). This product is a **serial remaining-balance / classification-gate forecast honesty** workflow — not citation-issuing software.

---

## Personas

| Persona | Role enum | Needs |
|---------|-----------|-------|
| **EHS / safety analyst** | `analyst` | Enter citation facts, run serial forecast, batch citations, see each reduction step |
| **Compliance auditor** | `auditor` | Read-only catalogs and forecasts; audit trail + goldens; export CSV; cannot PATCH citations |
| **Org admin** | `admin` | Members, API tokens, webhook HMAC secret |
| **FP&A partner** (viewer via honesty + detail steps) | often auditor or analyst-read | Serial vs additive / statutory-max failure modes visible |

---

## Unique domain claim (must remain)

**GBP × serial remaining-balance reductions** with **classification-gated ineligibility** (willful / repeat / FTA / high-gravity Quick Fix) — against golden fixtures. If serial math or gates are missing, the product collapses to a flat % calculator clone. Not statutory-max accrual, not dual-signer, not additive %.

---

## User stories + acceptance criteria

### US-1 — Catalog citations

**As** an analyst, **I want** a paginated list of citations filtered by classification, gravity, and proposed amount, **so that** I can find citations that need serial-forecast attention.

**AC**

- Given org-scoped citations, when I open `/orgs/:orgId/citations`, then I see only that org’s rows.
- Filters for classification, gravity, amount change the result set.
- Unauthenticated requests return 401.
- Pagination works (integrate+).

### US-2 — Edit citation facts and run serial forecast

**As** an analyst, **I want** to edit classification, gravity, GBP, and reduction pcts on a citation, then POST forecast, **so that** I lock a proposed penalty with algorithm version and visible serial steps.

**AC**

- PATCH `/orgs/:orgId/citations/:id` succeeds for analyst; fails for auditor.
- POST `/orgs/:orgId/citations/:id/forecast` returns `{ status: "ok", penalty, algorithm_version }` on valid inputs matching algorithm v0.
- Serious serial toy (GBP $5,000, size 30%, history 10%, good faith 15%) yields **2677.5** (fixture A).
- Full Quick Fix path toy yields **1071** (fixture N / J shapes per fixtures).
- Detail UI shows Size → History → Good Faith → Quick Fix remaining balances.

### US-3 — Reject statutory-max and additive cheats

**As** the product, **I must** reject forecasts that start from statutory max or apply additive % sums, **so that** cheat theater cannot pass as a happy path.

**AC**

- `use_statutory_max=true` → 422 (fixture C).
- `additive_cheat=true` → 422 (fixture K).
- UI never presents these as valid “final” forecasts.
- Honesty page contrasts serial $2,677.50 vs additive miss (~$2,250 toy).

### US-4 — Classification gates

**As** an analyst, **I want** willful / repeat / FTA (and high-gravity Quick Fix) gates to reject ineligible reductions, **so that** flat “apply all discounts” cannot invent proposed cash.

**AC**

- Size on willful/repeat → reject `size_on_willful_or_repeat` (fixtures B, F).
- Good faith on willful/repeat/FTA → reject (fixtures H, L, …).
- Quick Fix on willful/repeat/FTA or high-gravity serious → reject (fixtures I, O, Y, …).
- Willful history-only path may still apply history when size/GF/QF are zero (fixture N).

### US-5 — Batch independent forecasts

**As** an analyst, **I want** to queue many citation ids on `/orgs/:orgId/batch/forecast`, **so that** citations run without shared mutable mid-batch penalty state.

**AC**

- Each citation run is independent; one failure does not rewrite siblings.
- No dual-approver gate appears in the batch UI.

### US-6 — Audit trail

**As** an auditor, **I want** append-only events for create, recalc, and gate rejects, **so that** I can explain who locked what.

**AC**

- GET `/orgs/:orgId/audit` filterable by org/citation/actor/reject reason.
- Auditor/admin can export CSV; auditor cannot mutate citations.
- Events are append-only (no silent edit of history).

### US-7 — Goldens browser

**As** an auditor, **I want** read-only cards for `docs/ideas/fixtures/oshamult-*` vs the live engine, **so that** sustain proves unique-claim coverage.

**AC**

- GET `/orgs/:orgId/goldens` shows pass/fail vs live engine.
- ≥25 paper fixtures remain green in CI at sustain.
- No mutate controls on this page.

### US-8 — Org settings and webhook

**As** an admin, **I want** members, roles, API tokens, and webhook HMAC secret, **so that** inbound citation pushes can land safely.

**AC**

- GET/PATCH `/orgs/:orgId/settings` admin-only.
- POST `/webhooks/citations` requires valid HMAC; supports idempotency key.
- Replay with same idempotency key does not duplicate citations.

### US-9 — Money honesty education

**As** any authenticated user, **I want** a static honesty page that states serial ≠ additive, GBP ≠ statutory max, v0 order ≠ live FOM HTML, and Kill A still stands, **so that** digests cannot claim OIS replacement.

**AC**

- Kill A sentence present in DOM: consultants and counsel still model; serial-math / gate honesty experiment.
- Statutory-max and additive failure modes explained in dollars.
- Link to illustrative toys — not a live citation.
- Forbidden copy absent: “replaces OIS/OSHA/counsel”, “issues the citation”, always additive %.

---

## Out of scope (v1 / activation)

- Issuing, contesting, or settling OSHA citations; OIS replacement
- Silently matching live FOM HTML order without `oshamult-v1` dual re-green
- Dual-approver status workflows
- Serious-willful Table 6-4 size buckets as v0 happy path (floor fence in SIZE-TABLE)
- Market proof from fixture pass counts
- Deposit-gap / lesser-of / drawback math (other seeds)

---

## Non-goals

1. Becoming the system of record for OSHA citation issuance.
2. Winning commercially against consultants (Kill A stands).
3. Shipping smoke or a single discount calculator as sustain.
4. Claiming product-market demand from research goldens.
5. Noun-swapping dual-gate FSMs into “penalty status boards.”

---

## Dependencies / fences (cite, do not weaken)

| Fence | Doc |
|-------|-----|
| Kill A | `oshamult-VALUE-STAKES.md`, `oshamult-PRODUCT-FRAMING.md` |
| Serial remaining-balance | `oshamult-SERIAL-FENCE.md` |
| Size / order lock | `oshamult-SIZE-TABLE.md` |
| Algorithm v0 | `oshamult-algorithm.md` |
| API surface | `oshamult-API-CONTRACT.md` — do not invent contradicting routes |
| Comprehensive bar | `docs/COMPREHENSIVE_PRODUCT.md` |

---

## Explicit non-action

Do not open `projects/oshamult/` from this PRD. Do not flip `current_idea` to oshamult while lesserof holds hours (`oshamult-POST-LESSEROF-RUN.md`).
