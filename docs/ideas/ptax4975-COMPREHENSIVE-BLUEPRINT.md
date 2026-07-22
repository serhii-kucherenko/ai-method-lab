# ptax4975 — comprehensive product blueprint

**Status:** paper only. `current_idea` under hours hold.  
**Bar:** `docs/COMPREHENSIVE_PRODUCT.md`  
**G6:** `ptax4975-G6-summary.md` · fences: `ptax4975-FMV-FENCE.md`, `ptax4975-TAXABLE-PERIOD-FENCE.md` · cites: `ptax4975-STATUTE-CITATIONS.md`  
**Unique claim:** 15% × year-parts then 100% if uncorrected + optional greater-of FMV — not flat once-excise, not dual-signer.

## Goal

A multi-page ERISA/tax **excise forecast** workflow for prohibited transactions under IRC § 4975 — not a one-field “15% once” calculator and not Form 5330 filing software.

Kill A stands. Digests: forecast / method experiment.

## Aggregates (≥3)

1. **Organization** — tenants, roles (`analyst`, `auditor`, `admin`)  
2. **Prohibited-transaction fact set** — amount / FMV pair, year-parts, corrected flag  
3. **Excise run** — locked initial + additional + total + algorithm version + actor + timestamp  
4. **Audit event** — append-only  
5. **Goldens pack** — paper fixtures  

## Pages (≥4 — target 7)

| Page | Purpose | Role |
|------|---------|------|
| **1. Transactions catalog** | Filter by corrected / total exposure | analyst, auditor |
| **2. Transaction detail** | Edit facts; run excise forecast; show tier breakdown | analyst |
| **3. Batch forecast** | Multiple PTs; independent runs | analyst |
| **4. Audit log** | Filter + CSV | auditor, admin |
| **5. Goldens browser** | Paper fixtures vs live engine | auditor |
| **6. Money honesty** | Kill A / Form 5330 disclaimer; FMV fence callout | all |
| **7. Org settings** | Members, tokens, webhook | admin |

## Features (≥6 beyond CRUD)

1. 15% × year-parts initial tax  
2. 100% additional if uncorrected  
3. Greater-of FMV pair (v0) with understate reject  
4. Flat-excise cheat reject  
5. Batch + concurrency independence  
6. Audit export  
7. Bearer auth + RBAC  
8. Signed webhook + idempotency  
9. Pagination  
10. Fixture browser  

## Forbidden in build

- Dual-approver status as domain  
- Claiming Form 5330 / IRS / DOL / counsel replacement  
- Highest-FMV-during-period without versioned dual suite (`ptax4975-FMV-FENCE.md`)  
- Automatic (f)(2) notice/assessment/correction year-parts without dual suite (`ptax4975-TAXABLE-PERIOD-FENCE.md`)  
- Single calculator page as sustain  

## Phase plan (when build starts)

| Phase | Scope |
|-------|-------|
| smoke | Org + PT + excise calc + ≥25 goldens |
| crud | Catalog + detail + RBAC |
| workflow | Batch + honesty + audit |
| integrate | Webhook + pagination |
| scale | Concurrent independent PTs |
| sustain | All pages + try.html of flat-once vs year-parts miss |

## Explicit non-actions

No `projects/ptax4975/` until `FLIP_PATH_READY`.
