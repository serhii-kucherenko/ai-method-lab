# lesserof — API contract (seed paper)

**Status:** seed only. Activate only after htsroute clears and depositgap is not ahead.  
**Sources:** `lesserof-COMPREHENSIVE-BLUEPRINT.md`, `lesserof-PAGE-SPECS.md`, `lesserof-algorithm.md`

## Auth

| Item | Spec |
|------|------|
| Scheme | Bearer token |
| Tenant | All routes scoped by `orgId` |
| Roles | `analyst` \| `auditor` \| `admin` |

## Core resources

| Resource | Methods | Notes |
|----------|---------|-------|
| `/orgs/:orgId/claim-lines` | GET list, POST create | Paginate; filter basis / destination / status |
| `/orgs/:orgId/claim-lines/:id` | GET, PATCH | Auditor cannot PATCH |
| `/orgs/:orgId/claim-lines/:id/forecast` | POST | Stacked TFTEA → USMCA + basket gate; locks recoverable |
| `/orgs/:orgId/claim-lines/:id/lane-compare` | GET | Direct-ID vs substitution on shared paid amount |
| `/orgs/:orgId/batch/forecast` | POST | Array of line ids; independent runs |
| `/orgs/:orgId/forecast-vs-actual` | GET | Naive / TFTEA-only / stacked / reject deltas |
| `/orgs/:orgId/audit` | GET | Filter + CSV export |
| `/orgs/:orgId/goldens` | GET | Read-only fixture browser |
| `/orgs/:orgId/settings` | GET/PATCH | Tokens, webhook secret (admin) |
| `/webhooks/claim-lines` | POST | HMAC signed; idempotency key |

## Forecast request / response (v0)

Request fields mirror algorithm inputs: `claim_basis`, `hts8`, `hts10`, `us_duty_paid`, `substitute_duty_column`, `export_destination`, `usmca_export_duty`, `basket_other_flag`, `request_lesser_of_on_direct_id` (must be false/absent).

Success:
```json
{
  "status": "ok",
  "tftea_cap": 9900,
  "usmca_cap": 0,
  "recoverable": 0,
  "algorithm_version": "lesserof-v0"
}
```

Reject: `{ "status": "reject", "reason": "..." }` — e.g. basket_other, wrong_mode_direct_id, missing_usmca_partner.

## Honesty constraints

- No endpoint that “files” ACE / CBP drawback
- Direct-ID + lesser-of request → 422
- Basket “other” without matching non-other HTS10 → reject (not silent $0 lesser-of)
- Digests carry Kill A workflow-experiment language

## Explicit non-action

Paper only until activation queue reaches this seed.
