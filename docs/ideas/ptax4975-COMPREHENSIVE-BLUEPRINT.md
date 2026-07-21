# ptax4975 — comprehensive product blueprint (seed stub)

**Status:** seed only — paper blueprint for a future activate.  
**Bar:** `docs/COMPREHENSIVE_PRODUCT.md`  
**G6:** `ptax4975-G6-summary.md`  
**Unique claim:** 15% × year-parts then 100% if uncorrected + optional greater-of FMV — not flat once-excise, not dual-signer.

## Aggregates (≥3)

1. Organization — tenants, roles (`analyst`, `auditor`, `admin`)  
2. Prohibited-transaction fact set — amount / FMV pair, year-parts, corrected flag  
3. Excise run — locked initial + additional + total + algorithm version + actor + timestamp  
4. Audit event — append-only  
5. Goldens pack — paper fixtures  

## Pages (≥4)

| Page | Purpose |
|------|---------|
| 1. Transactions catalog | Filter by corrected / total exposure |
| 2. Transaction detail | Edit facts; run excise forecast |
| 3. Batch forecast | Multiple PTs; independent runs |
| 4. Audit log | Filter + CSV |
| 5. Goldens browser | Paper fixtures vs live engine |
| 6. Money honesty | Static Kill A / Form 5330 disclaimer |
| 7. Org settings | Members, tokens, webhook |

## Explicit non-actions

No product folder while htsroute holds the slot. Prefer depositgap / lesserof / oshamult first.
