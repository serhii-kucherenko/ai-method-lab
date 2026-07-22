# c1592 — API contract (paper)

**Status:** framed research (`current_idea`); hours hold.  
**Sources:** `c1592-COMPREHENSIVE-BLUEPRINT.md`, `c1592-ERD.md`, `c1592-algorithm.md`

## Auth

| Item | Spec |
|------|------|
| Scheme | Bearer token |
| Tenant | All routes scoped by `orgId` |
| Roles | `analyst` \| `auditor` \| `admin` |

## Core resources

| Resource | Methods | Notes |
|----------|---------|-------|
| `/orgs/:orgId/violations` | GET list, POST create | Filter culpability / branch |
| `/orgs/:orgId/violations/:id` | GET, PATCH | Auditor cannot PATCH |
| `/orgs/:orgId/violations/:id/forecast` | POST | Statutory max; locks `penalty_max` + `branch` |
| `/orgs/:orgId/batch/forecast` | POST | Array of violation ids; independent runs |
| `/orgs/:orgId/audit` | GET | Filter + CSV export |
| `/orgs/:orgId/goldens` | GET | Read-only fixture browser |
| `/orgs/:orgId/settings` | GET/PATCH | Tokens, webhook secret (admin) |
| `/webhooks/violations` | POST | HMAC signed; idempotency key |

## Forecast request / response (v0)

Request fields: `culpability`, `duty_loss`, `domestic_value`, `dutiable_value`, `flat_2x_cheat`, `dual_approver_cheat`, `ignore_domestic_cap`.

Success:
```json
{
  "status": "ok",
  "penalty_max": 200000,
  "branch": "lesser_of_duty",
  "algorithm_version": "c1592-v0"
}
```

Reject:
```json
{
  "status": "reject",
  "reason": "flat_2x_cheat"
}
```

## Honesty constraints

- Response is a **statutory maximum**, never a mitigated guideline amount.
- No automatic prior-disclosure fields in v0 happy path.
- Auditor GET-only on mutate routes → 403.
