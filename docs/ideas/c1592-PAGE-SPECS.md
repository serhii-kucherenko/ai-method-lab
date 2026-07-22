# c1592 — page specs (paper)

**Paper only.** Hours hold. Aligns with comprehensive blueprint (≥7 pages).

| Page | Primary job | Must show |
|------|-------------|-----------|
| Violations catalog | List / filter | Culpability, last branch, last max |
| Violation detail | Edit facts + forecast | `penalty_max`, `branch`, reject reasons |
| Batch forecast | Independent runs | Per-row max + branch; no shared mutable state |
| Audit log | Read + CSV | Actor, action, violation id, timestamp |
| Goldens browser | Fixture vs live | Dual-suite ids; pass/fail |
| Money honesty | Kill A + fences | Not CBP assessed; not mitigated; PD not auto |
| Org settings | Admin tokens / webhook | HMAC secret; role labels |

## Interaction rules

- Auditor: read-only on catalog/detail (no PATCH, no forecast mutate if product locks runs via separate POST — auditors may POST forecast only if PRODUCT says read-forecast; default: analyst/admin only).
- Forecast result is labeled **statutory maximum**.
- No “mitigated starting point” field on any page in v0.
