# ptax4975 — amount-involved / taxable-period fence (seed paper)

**State:** seed only. Expands the “Fence (not yet)” column in `ptax4975-STATUTE-CITATIONS.md`.  
**Not Form 5330 parity.** Digests must not claim IRS / DOL replacement.

## What § 4975 actually requires (beyond v0 toys)

| Topic | Statute | v0 | Future version needs |
|-------|---------|----|----------------------|
| Initial tax | (a) 15% × each year/part in taxable period | `0.15 * amount * year_parts` | Derive `year_parts` from real dates |
| Additional tax | (b) 100% if not corrected in taxable period | `corrected` boolean | Correction-period end vs taxable-period end |
| Taxable period end | (f)(2) earliest of notice / assessment / correction | caller supplies year_parts | Explicit end-date enum |
| Amount involved | (f)(4) greater-of money/FMV; (b) uses **highest FMV during period** | greater-of two inputs for both tiers | Separate FMV series for second tier |
| Services | (f)(4) excess compensation only in listed cases | not an enum | `excess_compensation` path |

## Honesty rejects already in goldens

- Flat once-excise cheat  
- Understating amount vs greater-of FMV pair  
- Non-positive amount / year_parts

## Digests / PRODUCT language

Say **forecast of first- and second-tier excise shape** — not “we file Form 5330.” Kill A: counsel and tax software still win commercially.

## Explicit non-actions

No product. Behind depositgap / lesserof / oshamult. Do not “fix” v0 to highest-during-period FMV without a dual suite bump.
