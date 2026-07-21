# oshamult — comprehensive product blueprint (pre-build, parallel seed)

**Status:** paper only. Parallel seed — **not** `current_idea`. Prefer depositgap → lesserof first.  
**Bar:** `docs/COMPREHENSIVE_PRODUCT.md`  
**G6:** `oshamult-G6-summary.md` · size lock: `oshamult-SIZE-TABLE.md` · stakes: `oshamult-VALUE-STAKES.md`  
**Unique claim:** GBP × **serial** remaining-balance reductions with classification-gated ineligibility — not statutory-max accrual, not dual-signer, not additive %.

## Goal

A multi-page EHS/finance **proposed-penalty forecast** workflow: Size → History → Good Faith → Quick Fix (v0 lock) with willful/repeat/FTA / high-gravity Quick Fix gates — not a one-field “discount calculator.”

Kill A stands commercially. Digests: method / workflow experiment.

## Aggregates (≥3)

1. **Organization** — tenants, members, roles (`analyst`, `auditor`, `admin`)
2. **Citation** — classification, gravity tier, GBP, size/history/good-faith/quick-fix inputs, locked proposed penalty + algorithm version
3. **Penalty run snapshot** — step-by-step remaining balances for audit
4. **Audit event** — append-only creates, recalcs, gate rejects
5. **Goldens pack** — read-mostly FOM-shaped fixtures

## Pages (≥4 — target 7)

| Page | Purpose | Role |
|------|---------|------|
| **1. Citations catalog** | Filter by classification / gravity / proposed amount | analyst, auditor |
| **2. Citation detail** | Edit facts; run serial forecast; show each reduction step | analyst |
| **3. Batch forecast** | Multiple citations; independent runs | analyst |
| **4. Audit log** | Filter + CSV | auditor, admin |
| **5. Goldens browser** | Paper fixtures vs live engine | auditor |
| **6. Org settings** | Members, tokens, webhook | admin |
| **7. Money honesty** | Statutory max ≠ GBP; serial ≠ additive; Kill A footer | all |

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

## Forbidden in build

- Dual-approver status as domain  
- Claiming OIS / OSHA / counsel replacement  
- Silently matching live FOM order without `oshamult-v1` dual re-green  
- Single calculator page as sustain  

## Phase plan (when build starts)

| Phase | Scope |
|-------|-------|
| smoke | Org + citation + serial calc + ≥25 goldens |
| crud | Catalog + detail + RBAC |
| workflow | Batch + honesty page + audit |
| integrate | Webhook + pagination + rate limit |
| scale | Concurrent independent citations |
| sustain | All pages + try.html of serial vs additive miss |

## Explicit non-action

No `projects/oshamult/` while activation queue prefers depositgap / lesserof after htsroute.
