# Failure tags taxonomy

Standard tags for `fail_tags` in `matrix/cells/*.json`. Each oracle defines tier-specific tags; **`approach-violation`** is cross-cutting (method card broken mid-run).

## Cross-cutting

| Tag | Meaning |
|-----|---------|
| `approach-violation` | Required approach discipline skipped (e.g. impl before tests on A03) |

## P-smoke-001

| Tag | Meaning |
|-----|---------|
| `auth-missing` | Todo routes accept unauthenticated requests |
| `idor` | User can read or mutate another user's todos |
| `crud-broken` | Create/list/update/delete does not work for owner |
| `no-tests` | Oracle behaviors not covered by automated tests |

## P-crud-001

| Tag | Meaning |
|-----|---------|
| `rbac-broken` | Permission matrix not enforced |
| `migration-missing` | No schema migration after initial create |
| `no-negative-tests` | Negative permission cases not tested |

## P-workflow-001

| Tag | Meaning |
|-----|---------|
| `illegal-transition` | Illegal state change succeeds or fails opaquely |
| `no-audit` | Audit log missing actor, from/to, or timestamp |
| `race-corrupt` | Concurrent updates corrupt workflow state |

## P-integrate-001

| Tag | Meaning |
|-----|---------|
| `hmac-broken` | Invalid HMAC accepted or valid rejected |
| `not-idempotent` | Duplicate webhook double-applies side effects |
| `dependency-swallowed` | Dependency 5xx/timeout returns silent success |

## P-scale-001

| Tag | Meaning |
|-----|---------|
| `pagination-corrupt` | Pages skip, duplicate, or gap items |
| `unbounded-list` | Default or max `limit` not bounded |
| `rate-limit-missing` | No 429 after threshold |

## Severity (for promotion / triple-test)

| Level | Tags |
|-------|------|
| **Critical** | `auth-missing`, `idor`, `rbac-broken`, `hmac-broken`, `race-corrupt`, `pagination-corrupt` |
| **Major** | `crud-broken`, `illegal-transition`, `not-idempotent`, `dependency-swallowed`, `migration-missing` |
| **Minor** | `no-tests`, `no-negative-tests`, `no-audit`, `unbounded-list`, `rate-limit-missing`, `approach-violation` |

Source oracles: `oracles/P-*.md`. Record only tags that actually failed; empty array on pass.
