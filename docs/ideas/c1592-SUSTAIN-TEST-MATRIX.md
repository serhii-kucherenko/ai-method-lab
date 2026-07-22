# c1592 — sustain test matrix

**Status:** docs only until `FLIP_PATH_READY`.  
**Bar:** `docs/COMPREHENSIVE_PRODUCT.md` + `c1592-G6-summary.md` + `c1592-COMPREHENSIVE-BLUEPRINT.md`

Vanity fixture counts alone never pass. Dual-impl drift fails the phase.

---

## Target

| Metric | Floor | Notes |
|--------|------:|-------|
| **Total automated tests at sustain** | **≥55** | Goldens + API + UI + RBAC + webhook + concurrency + copy + dual-impl |
| Unique-claim goldens | **≥26** | All `docs/ideas/fixtures/c1592-*.json` |
| Pages with critical-path coverage | **7** | Catalog, Detail, Batch, Audit, Goldens, Honesty, Settings |
| Dual-impl CI jobs | **2** green | fixtures + dual |

**Estimated sustain suite: ~60 tests**.

---

## Suites

| Prefix | Suite | Est. |
|--------|-------|-----:|
| `G-` | Unique-claim goldens | 26 |
| `A-` | API / contract | 8 |
| `P-` | Page critical paths | 7 |
| `R-` | RBAC / tenancy | 5 |
| `W-` | Signed webhook + idempotency | 4 |
| `C-` | Concurrency / multi-violation | 3 |
| `M-` | Money-honesty + Kill A copy | 4 |
| `D-` | Dual-impl CI | 3 |
| | **Total** | **≈60** |

## Instant fail

Flat-2×-only suite; digests claim CBP/counsel replacement; dual-impl A≠B.
