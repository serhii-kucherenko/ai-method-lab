# ptax4975 — algorithm paper (seed draft)

**State:** seed only. Behind depositgap / lesserof / oshamult. Not framed.  
**Not an oracle. No product folder.**

## Goal

Compute IRC **§ 4975** prohibited-transaction excise: **15% of the amount involved** for each year (or part year) in the taxable period, then **100%** additional tax if not corrected within the correction period.

Primary: 26 U.S.C. § 4975(a)/(b)/(f). Scope fence: tax calc only — not fiduciary litigation / Form 5330 filing replacement.

## Inputs (v0)

| Field | Meaning |
|-------|---------|
| `amount_involved` | Dollars (already resolved greater-of FMV rule — v0 takes resolved input) |
| `year_parts` | Number of years or part-years in the taxable period (≥ 1; may be fractional in v0 toys) |
| `corrected` | boolean — true if corrected within correction period |
| `fmv_a` / `fmv_b` | Optional pair — when `use_fmv_greater_of`, amount = max(a,b) |
| `understate_amount` | If true with amount < greater-of → reject (`greater_of_cheat`) |

## Procedure (v0)

1. Reject if `amount` ≤ 0 or `year_parts` ≤ 0 or not finite.  
2. Reject if `flat_excise_cheat === true`.  
2b. If FMV pair present and `understate_amount` with amount < max(FMV) → reject.  
2c. Resolve `amount` from greater-of when `use_fmv_greater_of`, else `amount_involved`.  
3. `initial_tax = 0.15 * amount * year_parts`.  
4. `additional_tax = corrected === true ? 0 : amount` (missing corrected → uncorrected).  
5. `total = initial_tax + additional_tax`.  
6. Return `{ status: "ok", initial_tax, additional_tax, total }`.

## Worked toy

| Input | Value |
|-------|-------|
| amount_involved | $10,000 |
| year_parts | 2 |
| corrected | true |
| initial_tax | **$3,000** |
| additional_tax | $0 |
| total | **$3,000** |

Same facts, `corrected: false` → additional **$10,000**, total **$13,000**.

## Anti-patterns

| Anti-pattern | Why |
|--------------|-----|
| Flat “15% once” ignoring year-parts | Misses statute |
| Dual counsel approval workflow | Dual-gate clone |
| Claiming Form 5330 / DOL replacement | Kill A theater |

## Explicit non-actions

No activation while htsroute holds the slot. Checkers: `check-ptax4975-fixtures.mjs`, `check-ptax4975-dual.mjs`.
