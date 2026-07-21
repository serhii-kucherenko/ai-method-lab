# oshamult — comprehensive product blueprint (seed stub)

**Status:** seed only — paper blueprint for a future activate.  
**Bar:** `docs/COMPREHENSIVE_PRODUCT.md`  
**G6:** `oshamult-G6-summary.md`  
**Unique claim:** GBP × **serial** Size → History → Good Faith → Quick Fix with classification-gated ineligibility — not statutory-max accrual, not dual-signer.

## Aggregates (≥3)

1. Organization — tenants, roles (`analyst`, `auditor`, `admin`)
2. Citation / violation — classification, gravity tier, GBP, employer size inputs, reduction percents
3. Penalty run — locked proposed penalty + algorithm version + actor + timestamp
4. Audit event — append-only
5. Goldens pack — read-mostly FOM-shaped fixtures

## Pages (≥4)

| Page | Purpose |
|------|---------|
| 1. Citations catalog | Filter by classification / gravity / proposed amount |
| 2. Citation detail | Edit facts; run serial penalty forecast |
| 3. Batch forecast | Multiple citations; independent runs |
| 4. Audit log | Filter + CSV |
| 5. Goldens browser | Paper fixtures vs live engine |
| 6. Org settings | Members, tokens, webhook |
| 7. Money honesty | Statutory max ≠ GBP; Kill A footer |

## Features (≥6 beyond CRUD)

1. Serial remaining-balance reductions (not additive %)  
2. Classification gates (willful/repeat/FTA / high-gravity Quick Fix)  
3. Size-on-willful/repeat reject (v0)  
4. Batch + concurrency independence  
5. Audit export  
6. Bearer auth + RBAC  
7. Signed webhook + idempotency  
8. Pagination  
9. Fixture browser  
10. Statutory-max / additive cheats reject  

## Forbidden

- Dual-approver status as domain  
- Claiming OIS / OSHA replacement  
- Single calculator page as sustain  

## Explicit non-action

No `projects/oshamult/` while activation queue prefers depositgap / lesserof after htsroute.
