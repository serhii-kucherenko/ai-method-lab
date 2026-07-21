# lesserof — sustain test matrix (seed paper)

**Status:** docs only until activation after htsroute/depositgap priority.  
**Bar:** `docs/COMPREHENSIVE_PRODUCT.md` + `lesserof-ACCEPTANCE.md`

## Target

| Metric | Floor |
|--------|------:|
| Total automated tests at sustain | **≥55** |
| Unique-claim goldens | **≥23** |
| Pages with critical-path coverage | **7** |
| Dual-impl CI | **2** green |

## Suites (est.)

| Prefix | Suite | Est. |
|--------|-------|-----:|
| G- | Unique-claim goldens | 23 |
| A- | API / contract | 10 |
| P- | Page critical paths | 7 |
| R- | RBAC / tenancy | 5 |
| W- | Webhook + idempotency | 4 |
| C- | Concurrency / batch | 3 |
| M- | Kill A / honesty copy | 4 |
| D- | Dual-impl | 2 |
| | **Total** | **≈58** |

## Explicit fail

Smoke-as-sustain; “99% of paid always”; dual-approver as domain.

## Explicit non-action

No `projects/lesserof/` today.
