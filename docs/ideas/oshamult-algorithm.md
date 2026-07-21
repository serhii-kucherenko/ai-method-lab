# oshamult — algorithm paper (seed draft)

**State:** seed only. Behind depositgap / lesserof. Not framed. Not `current_idea`.  
**Not an oracle. No product folder.**

## Goal

Forecast an OSHA **proposed civil penalty** from a **gravity-based penalty (GBP)** by applying FOM Ch. 6 **serial** reduction factors — not a flat “statutory maximum” accrual.

Primary: OSHA Field Operations Manual Chapter 6; 29 U.S.C. § 666; 29 CFR § 1903.15.  
Cite: https://www.osha.gov/fom/chapter-6

## Inputs (v0 — paper fixtures)

| Field | Meaning |
|-------|---------|
| `classification` | `serious` \| `other` \| `willful` \| `repeat` \| `fta` |
| `gravity_tier` | `low` \| `moderate` \| `high` (Quick Fix gate for serious) |
| `gbp_amount` | Gravity-based penalty dollars (input) |
| `size_pct` | 0–1 size reduction (caller supplies from FOM size table) |
| `history_pct` | 0–1 history reduction |
| `good_faith_pct` | 0–1 good-faith reduction |
| `quick_fix_pct` | 0–1 Quick Fix reduction |
| `use_statutory_max` | if true → reject |
| `additive_cheat` | if true → reject |

## Procedure (v0)

1. Reject if `gbp_amount` ≤ 0 or any pct outside [0, 1].  
2. Reject `use_statutory_max` / `additive_cheat`.  
3. If `willful` \| `repeat` and `size_pct` > 0 → reject (`size_on_willful_or_repeat`).  
4. If `willful` \| `repeat` \| `fta` and `good_faith_pct` > 0 → reject.  
5. If (`willful` \| `repeat` \| `fta`) or (serious + high gravity) and `quick_fix_pct` > 0 → reject.  
6. Serial remaining-balance (fixture-locked order): **Size → History → Good Faith → Quick Fix**  
   (Skip size multiply when willful/repeat — size already gated to 0.)  
7. Return `{ status: "ok", penalty }`.

Note: Live FOM HTML may list Size→Good Faith→History→Quick Fix; v0 stays locked to the A–N golden order until a re-versioned dual suite flips.

## Worked toys

| Case | Result |
|------|--------|
| GBP $5,000, size 30%, history 10%, good faith 15% | **$2,677.50** (fixture A) |
| GBP $7,000, size 70%, history 20%, good faith 25%, Quick Fix 15% | **$1,071** (fixture N) |

## Explicit non-actions

No product. Prefer depositgap after htsroute. Checkers: `check-oshamult-fixtures.mjs`, `check-oshamult-dual.mjs`.
