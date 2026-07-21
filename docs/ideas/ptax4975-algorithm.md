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
| `year_parts` | Number of years or part-years in the taxable period (≥ 1) |
| `corrected` | boolean — true if corrected within correction period |
| `flat_excise_cheat` | if true → reject (must not skip year-parts) |

## Procedure (v0)

1. Reject if `amount_involved` ≤ 0 or `year_parts` < 1 or not finite.  
2. Reject if `flat_excise_cheat === true`.  
3. `initial_tax = 0.15 * amount_involved * year_parts`.  
4. `additional_tax = corrected ? 0 : amount_involved` (100% second tier).  
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

No activation while htsroute holds the slot. Checker: `check-ptax4975-fixtures.mjs`.
