# ptax4975 — API contract

**Status:** framed research (`current_idea`); hours hold.  
**Sources:** `ptax4975-COMPREHENSIVE-BLUEPRINT.md`, `ptax4975-PAGE-SPECS.md`, `ptax4975-algorithm.md`, `ptax4975-TAXABLE-PERIOD-FENCE.md`

## Auth

| Item | Spec |
|------|------|
| Scheme | Bearer token |
| Tenant | All routes scoped by `orgId` |
| Roles | `analyst` \| `auditor` \| `admin` |

## Core resources

| Resource | Methods | Notes |
|----------|---------|-------|
| `/orgs/:orgId/transactions` | GET list, POST create | Filter corrected / exposure |
| `/orgs/:orgId/transactions/:id` | GET, PATCH | Auditor cannot PATCH |
| `/orgs/:orgId/transactions/:id/forecast` | POST | 15% × year-parts + 100% if uncorrected; locks taxes |
| `/orgs/:orgId/batch/forecast` | POST | Array of PT ids; independent runs |
| `/orgs/:orgId/audit` | GET | Filter + CSV export |
| `/orgs/:orgId/goldens` | GET | Read-only fixture browser |
| `/orgs/:orgId/settings` | GET/PATCH | Tokens, webhook secret (admin) |
| `/webhooks/transactions` | POST | HMAC signed; idempotency key |

## Forecast request / response (v0)

Request fields: `amount_involved`, `year_parts`, `corrected`, `fmv_a`, `fmv_b`, `use_fmv_greater_of`, `understate_amount`, `flat_excise_cheat`.

Success:
```json
{
  "status": "ok",
  "initial_tax": 3000,
  "additional_tax": 0,
  "total": 3000,
  "algorithm_version": "ptax4975-v0"
}
```

Reject: `{ "status": "reject", "reason": "..." }` — e.g. flat_excise_cheat, greater_of_cheat, bad_year_parts.

## Honesty constraints

- No endpoint that “files” Form 5330 or replaces DOL / counsel
- Flat once-excise cheat → 422
- `year_parts` is an explicit input in v0 (not derived from notice/assessment/correction dates)
- Digests: forecast / method experiment; Kill A stands

## Explicit non-action

No `projects/ptax4975/` until `FLIP_PATH_READY`.
