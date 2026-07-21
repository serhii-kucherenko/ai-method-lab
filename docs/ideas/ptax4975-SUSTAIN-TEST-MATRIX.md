# ptax4975 — sustain test matrix (seed paper)

**Status:** docs only until activation after higher-priority seeds clear.  
**Bar:** `docs/COMPREHENSIVE_PRODUCT.md` + `ptax4975-G6-summary.md` + `ptax4975-COMPREHENSIVE-BLUEPRINT.md`

Vanity fixture counts alone never pass. Dual-impl drift fails the phase.

---

## Target

| Metric | Floor | Notes |
|--------|------:|-------|
| **Total automated tests at sustain** | **≥58** | Goldens + API + UI + RBAC + webhook + concurrency + copy + dual-impl |
| Unique-claim goldens | **≥35** | All `docs/ideas/fixtures/ptax4975-*.json` |
| Pages with critical-path coverage | **7** | Catalog, Detail, Batch, Audit, Goldens, Honesty, Settings |
| Dual-impl CI jobs | **2** green | fixtures + dual |

**Estimated sustain suite: ~65 tests**.

---

## Suites

| Prefix | Suite | Est. |
|--------|-------|-----:|
| `G-` | Unique-claim goldens | 35 |
| `A-` | API / contract | 8 |
| `P-` | Page critical paths | 7 |
| `R-` | RBAC / tenancy | 5 |
| `W-` | Signed webhook + idempotency | 4 |
| `C-` | Concurrency / multi-PT | 3 |
| `M-` | Money-honesty + Kill A copy | 4 |
| `D-` | Dual-impl CI | 3 |
| | **Total** | **≈69** |

---

## Must-fail digests / PRODUCT

1. Claims Form 5330 / DOL replacement  
2. Flat “15% once” as the happy path  
3. Hides second-tier 100% when uncorrected  
4. Fixture counts as market proof  

## Explicit non-action

No product folder while htsroute holds the slot.
