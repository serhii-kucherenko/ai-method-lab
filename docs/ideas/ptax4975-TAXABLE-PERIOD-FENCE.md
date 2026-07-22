# ptax4975 — taxable-period end dates (research fence)

**State:** framed research (`current_idea`). Hours hold. Complements `ptax4975-FMV-FENCE.md`.

## Statute (f)(2)

Taxable period runs from the prohibited-transaction date to the **earliest of**:

1. Mailing of a notice of deficiency for the first-tier tax  
2. Assessment of the first-tier tax  
3. Correction of the prohibited transaction  

v0 fixtures take caller-supplied `year_parts` — they do **not** derive year-parts from these three dates.

## What digests may say

- Forecast uses **year-parts** as an explicit input (including fractional parts)  
- Full end-date enum is a **later version** with dual-suite bump  

## What digests must not say

- “We compute the taxable period end automatically like Form 5330 software”  
- Silent substitution of notice/assessment/correction dates without fixtures  

## Smoke implication (when flipped)

Day-1 may keep `year_parts` as input. Product honesty page must label end-date derivation as out of v0 scope (same pattern as highest-FMV-during-period for tier (b)).

## Explicit non-actions

No `projects/ptax4975/` until `FLIP_PATH_READY`. Do not encode end-date enum in v0 goldens without a dual bump.
