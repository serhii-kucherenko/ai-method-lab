# ptax4975 — excess-compensation path fence

**State:** framed research (`current_idea`). Hours hold. Complements `ptax4975-FMV-FENCE.md`.

## Statute (f)(4) services carve

For certain § 4975(d)(2)/(10) service cases, “amount involved” is **excess compensation only** — not the full payment.

v0 fixtures take a resolved `amount_involved` (or greater-of FMV pair). They do **not** encode an `excess_compensation` enum or service-transaction classifier.

## What digests may say

- Forecast takes an explicit amount (or greater-of two fair-value inputs)  
- Excess-compensation narrowing is a **later version** with dual-suite bump  

## What digests must not say

- “We compute excess compensation for every service PT automatically”  
- Silent substitution of full payment as amount involved when statute requires excess only  

## Smoke implication (when flipped)

Day-1 may keep amount as input. Honesty page must label excess-compensation narrowing as out of v0 scope.

## Explicit non-actions

No `projects/ptax4975/` until `FLIP_PATH_READY`. Do not add excess-comp enum to v0 goldens without a dual bump.
