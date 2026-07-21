# oshamult — sustain test matrix (seed paper)

**Status:** docs only until activation after higher-priority seeds clear.  
**Bar:** `docs/COMPREHENSIVE_PRODUCT.md` + `oshamult-G6-summary.md` + `oshamult-COMPREHENSIVE-BLUEPRINT.md`

Vanity fixture counts alone never pass. Dual-impl drift fails the phase.

---

## Target

| Metric | Floor | Notes |
|--------|------:|-------|
| **Total automated tests at sustain** | **≥55** | Goldens + API + UI + RBAC + webhook + concurrency + copy + dual-impl |
| Unique-claim goldens | **≥26** | All `docs/ideas/fixtures/oshamult-*.json` |
| Pages with critical-path coverage | **7** | Catalog, Detail, Batch, Audit, Goldens, Settings, Honesty |
| Dual-impl CI jobs | **2** green | fixtures + dual |

**Estimated sustain suite: ~58 tests**.

---

## Suites

| Prefix | Suite | Est. |
|--------|-------|-----:|
| `G-` | Unique-claim goldens | 26 |
| `A-` | API / contract | 8 |
| `P-` | Page critical paths | 7 |
| `R-` | RBAC / tenancy | 5 |
| `W-` | Signed webhook + idempotency | 4 |
| `C-` | Concurrency / batch | 3 |
| `M-` | Money-honesty + Kill A copy | 4 |
| `D-` | Dual-impl CI | 3 |
| | **Total** | **≈60** |

---

## Must-fail digests / PRODUCT

1. Claims to replace settlement counsel / OIS  
2. Accrue statutory max as the happy path  
3. Additive % instead of serial remaining-balance  
4. Fixture counts as market proof  

## Explicit non-action

No product folder while htsroute holds the slot.
