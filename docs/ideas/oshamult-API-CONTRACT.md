# oshamult — API contract (active research)

**Status:** paper during hours hold. `current_idea` = oshamult. Do not open `projects/oshamult/` until preflip.  
**Sources:** `oshamult-COMPREHENSIVE-BLUEPRINT.md`, `oshamult-PAGE-SPECS.md`, `oshamult-algorithm.md`

## Auth

| Item | Spec |
|------|------|
| Scheme | Bearer token |
| Tenant | All routes scoped by `orgId` |
| Roles | `analyst` \| `auditor` \| `admin` |

## Core resources

| Resource | Methods | Notes |
|----------|---------|-------|
| `/orgs/:orgId/citations` | GET list, POST create | Filter classification / gravity / amount |
| `/orgs/:orgId/citations/:id` | GET, PATCH | Auditor cannot PATCH |
| `/orgs/:orgId/citations/:id/forecast` | POST | Serial Size→History→Good Faith→Quick Fix; locks penalty |
| `/orgs/:orgId/batch/forecast` | POST | Array of citation ids; independent runs |
| `/orgs/:orgId/audit` | GET | Filter + CSV export |
| `/orgs/:orgId/goldens` | GET | Read-only FOM-shaped fixtures |
| `/orgs/:orgId/settings` | GET/PATCH | Tokens, webhook secret (admin) |
| `/webhooks/citations` | POST | HMAC signed; idempotency key |

## Forecast request / response (v0)

Request fields: `classification`, `gravity_tier`, `gbp_amount`, `size_pct`, `history_pct`, `good_faith_pct`, `quick_fix_pct`, `use_statutory_max`, `additive_cheat`.

Success (day-1 must expose **each** remaining-balance step — not only the final dollars):
```json
{
  "status": "ok",
  "penalty": 2677.5,
  "algorithm_version": "oshamult-v0",
  "steps": [
    { "factor": "size", "pct": 0.3, "balance_before": 5000, "balance_after": 3500 },
    { "factor": "history", "pct": 0.1, "balance_before": 3500, "balance_after": 3150 },
    { "factor": "good_faith", "pct": 0.15, "balance_before": 3150, "balance_after": 2677.5 },
    { "factor": "quick_fix", "pct": 0, "balance_before": 2677.5, "balance_after": 2677.5 }
  ]
}
```

Reject: `{ "status": "reject", "reason": "..." }` — e.g. size_on_willful_or_repeat, statutory_max, additive_cheat, quick_fix_ineligible.

## Honesty constraints

- No endpoint that “issues” OSHA citations or replaces OIS
- Statutory-max / additive cheats → 422
- Digests: forecast / method experiment; Kill A stands

## Explicit non-action

Paper only until hours + `oshamult-PREFLIP-CHECKLIST.md` clear. Forecast success **without** `steps[]` fails day-1 honesty.
