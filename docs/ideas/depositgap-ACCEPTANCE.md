# depositgap — paper product acceptance (pre-build)

**Not a green light.** Do not open `projects/depositgap/` while `htsroute` holds the slot. Use this bar *if/when* depositgap is activated and reaches `ready_to_build`.

Tied to: `depositgap-G6-summary.md`, `depositgap-algorithm.md`, `depositgap-challenge-ABC.md`, `depositgap-HYPOTHESIS-DRAFT.md`.

---

## A. Must-pass unique-claim scenarios

Product tests load all `docs/ideas/fixtures/depositgap-*.json`. At minimum:

| Scenario | Expect |
|----------|--------|
| Underdeposit + interest (A) | ok true_up with interest |
| Overdeposit refund path (B) | signed negative true_up |
| CVD twin (E) | same math, order_type CVD |
| Same-day window (G) | duty delta, interest 0 |
| Leap-year window (K) | days 366 interest |

## B. Must-reject cheats

1. `skip_interest=true` with `days > 0` (C, R)
2. Zero / non-positive entered value (D)
3. Missing / non-finite interest rate (P)
4. Negative deposit or assessed rate (I, Q)
5. Inverted dates (H)
6. Dual-approver / day-count-only / lesser-of costumes as “domain”

## C. Money-honesty checks (instant fail)

Acceptance **fails** if digests / PRODUCT / try-demo:

1. Claim to replace CBP liquidation or brokers
2. Present fixture counts as market proof
3. Hide interest line when days > 0
4. Treat deposit rate as final COGS in copy

Required Kill A line: forecast / method experiment only.

## D. Comprehensive bar

Per `docs/COMPREHENSIVE_PRODUCT.md` + `depositgap-SUSTAIN-TEST-MATRIX.md` (~62). Smoke-as-sustain fails. ≥8 pages from page specs.

## E. Dual-impl

`check-depositgap-fixtures.mjs` + `check-depositgap-dual.mjs` (or product ports) green in CI.

## Explicit non-action

No product folder today.
