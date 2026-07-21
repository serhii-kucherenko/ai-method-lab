# depositgap — sustain test matrix (seed paper)

**Status:** docs only until activation after `htsroute` clears and `ready_to_build`.  
**Bar:** `docs/COMPREHENSIVE_PRODUCT.md` + `depositgap-G6-summary.md` + `depositgap-COMPREHENSIVE-BLUEPRINT.md`  
**Workflow:** A03 test-first — RED suites before GREEN pages.

Vanity fixture counts alone never pass. Dual-impl drift fails the phase.

---

## Target

| Metric | Floor | Notes |
|--------|------:|-------|
| **Total automated tests at sustain** | **≥60** | Claim goldens + API + UI + RBAC + webhook + concurrency + copy + dual-impl |
| Unique-claim goldens | **≥23** | All `docs/ideas/fixtures/depositgap-*.json` |
| Pages with critical-path coverage | **8** | Catalog, Detail, Batch, Cash impact, Audit, Goldens, Settings, Honesty |
| Dual-impl CI jobs | **2** green | fixtures + dual checkers (or product-ported) |

**Estimated sustain suite: ~62 tests** (see rollup).

---

## Suites

| Prefix | Suite | Est. |
|--------|-------|-----:|
| `G-` | Unique-claim goldens | 23 |
| `A-` | API / contract | 10 |
| `P-` | Page critical paths | 8 |
| `R-` | RBAC / tenancy (incl. X) | 6 |
| `W-` | Signed webhook + idempotency | 4 |
| `C-` | Concurrency / batch (incl. Y) | 3 |
| `M-` | Money-honesty + Kill A copy | 5 |
| `D-` | Dual-impl CI | 3 |
| | **Total** | **≈62** |

---

## G — Unique-claim goldens (≥23)

| ID | Fixture | Expect |
|----|---------|--------|
| G-01 | A underdeposit | ok true_up with interest |
| G-02 | B overdeposit | signed refund |
| G-03 | C skip-interest equal rates | reject |
| G-04 | D zero value | reject |
| G-05 | E CVD twin | ok (same math) |
| G-06 | F all-others | ok |
| G-07 | G same-day | interest 0 |
| G-08–G-23 | H–W | per `depositgap-G5-cases.md` |

---

## Must-fail digests / PRODUCT

- Claims to replace CBP liquidation or brokers
- Day-count-only accrual without deposit vs assessed
- Dual-approver status as “domain”
- Skip-interest path presented as valid forecast

## Explicit non-action

No `projects/depositgap/` today.
