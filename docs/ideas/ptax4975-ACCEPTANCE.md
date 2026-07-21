# ptax4975 — paper product acceptance (pre-build)

**Not a green light.** Activate only after higher-priority items in `ACTIVATION_QUEUE.md` clear (htsroute → depositgap → lesserof → oshamult).

Tied to: `ptax4975-G6-summary.md`, `ptax4975-algorithm.md`, `ptax4975-challenge-ABC.md`.

---

## A. Must-pass unique-claim scenarios

Load all `docs/ideas/fixtures/ptax4975-*.json`. At minimum:

| Scenario | Expect |
|----------|--------|
| Two years corrected (A) | initial = 15% × amount × 2; additional = 0 |
| Same facts uncorrected (B) | +100% second tier |
| Greater-of FMV amount (P / K) | amount = max(fmv_a, fmv_b) |
| Fractional year-part (I, W) | year_parts > 0 may be fractional |
| Missing corrected (O) | treated as uncorrected |

## B. Must-reject cheats

1. Flat-excise cheat (C)  
2. Understate amount vs greater-of FMV (Q / L)  
3. Zero / negative amount (D, J)  
4. Non-positive or non-finite year_parts (G, R)  
5. Dual-approver / “flat 15% once” costumes as domain  

## C. Money-honesty / Kill A

Acceptance **fails** if digests claim Form 5330 / DOL replacement or present fixture counts as market proof. Required line: workflow / FP&A honesty experiment; counsel still files.

## D. Comprehensive bar

Must meet `docs/COMPREHENSIVE_PRODUCT.md` before sustain. Smoke-as-sustain fails. (Blueprint may be written at activation.)

## E. Dual-impl

`check-ptax4975-fixtures.mjs` + `check-ptax4975-dual.mjs` green in CI.

## Explicit non-action

No `projects/ptax4975/` today.
