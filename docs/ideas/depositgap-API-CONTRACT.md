# depositgap — API contract (seed paper)

**Status:** seed only. Do not open `projects/depositgap/` while `htsroute` holds the slot.  
**Sources:** `depositgap-COMPREHENSIVE-BLUEPRINT.md`, `depositgap-PAGE-SPECS.md`, `depositgap-algorithm.md`

## Auth

| Item | Spec |
|------|------|
| Scheme | Bearer token |
| Tenant | All routes scoped by `orgId` |
| Roles | `analyst` \| `auditor` \| `admin` |

## Core resources

| Resource | Methods | Notes |
|----------|---------|-------|
| `/orgs/:orgId/entries` | GET list, POST create | Paginated; filter POR / order_type / sign |
| `/orgs/:orgId/entries/:id` | GET, PATCH | Auditor cannot PATCH |
| `/orgs/:orgId/entries/:id/forecast` | POST | Runs deposit→assess→interest; locks money line |
| `/orgs/:orgId/batch/forecast` | POST | Array of entry ids; independent runs |
| `/orgs/:orgId/cash-impact` | GET | POR rollup |
| `/orgs/:orgId/audit` | GET | Filter + CSV export |
| `/orgs/:orgId/goldens` | GET | Read-only fixture browser status |
| `/orgs/:orgId/settings` | GET/PATCH | Tokens, webhook secret (admin) |
| `/webhooks/entries` | POST | HMAC signed; idempotency key |

## Forecast request / response (v0)

Request body fields mirror algorithm inputs: `order_type`, `deposit_rate`, `assessed_rate`, `rate_class`, `entered_value`, `order_published_on`, `liquidated_on`, `interest_annual_rate`, `skip_interest`.

Success:
```json
{
  "status": "ok",
  "duty_delta": 150000,
  "days": 365,
  "interest": 12000,
  "true_up": 162000,
  "algorithm_version": "depositgap-v0"
}
```

Reject: `{ "status": "reject", "reason": "..." }` — never invent assessed rates.

## Honesty constraints

- No endpoint that “finalizes” CBP liquidation
- `skip_interest=true` with `days > 0` → 422 reject
- Digests / PRODUCT must carry Kill A forecast-only language

## Explicit non-action

Paper only until activation after htsroute clears.
