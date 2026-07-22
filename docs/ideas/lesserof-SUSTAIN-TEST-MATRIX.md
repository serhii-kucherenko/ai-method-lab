# lesserof — sustain test matrix

**Status:** docs only until hours + preflip clear (`lesserof-PREFLIP-CHECKLIST.md`).  
**Bar:** `docs/COMPREHENSIVE_PRODUCT.md` + `lesserof-ACCEPTANCE.md`  
**Paper goldens now:** **25** dual-green (A–Y)

## Target

| Metric | Floor |
|--------|------:|
| Total automated tests at sustain | **≥60** |
| Unique-claim goldens | **≥25** |
| Pages with critical-path coverage | **7** |
| Dual-impl CI | **2** green |

## Suites (est.)

| Prefix | Suite | Est. |
|--------|-------|-----:|
| G- | Unique-claim goldens | 25 |
| A- | API / contract | 10 |
| P- | Page critical paths | 7 |
| R- | RBAC / tenancy | 5 |
| W- | Webhook + idempotency | 4 |
| C- | Concurrency / batch | 3 |
| M- | Kill A / honesty copy (incl. same-condition out-of-scope) | 5 |
| D- | Dual-impl | 2 |
| | **Total** | **≈61** |

## Explicit fail

Smoke-as-sustain; “99% of paid always”; dual-approver as domain; every Canada export claimed as wipe without same-condition fence.

## Explicit non-action

No `projects/lesserof/` during the hours hold.
