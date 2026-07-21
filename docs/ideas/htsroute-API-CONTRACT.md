# htsroute — HTTP contract (paper)

**Not a build ticket.** Encodes acceptance shapes so a future smoke cannot invent dual-gate CRUD and call it customs routing.

## Auth

`Authorization: Bearer <token>`  
Roles: `analyst` (classify), `auditor` (read-only list/get).

## Resources

### `POST /v1/orgs/:orgId/skus`

Create SKU fact card (draft). Body:

```json
{
  "chemical_form": "separately_defined",
  "therapeutic_or_prophylactic": true,
  "measured_dose": false,
  "retail_packing": false,
  "dosage_form_signal": "bulk_drum",
  "note_1a_food_or_supplement": false,
  "gri3_combination": false
}
```

Reject unknown enums with `400`. Do **not** accept `molecule_name` as a routing input (may store as label only).

### `POST /v1/orgs/:orgId/skus/:skuId/classify`

Runs `routeSku`. Returns:

```json
{
  "sku_id": "...",
  "route": "chapter_29_chemical",
  "locked_at": "ISO-8601",
  "algorithm_version": "htsroute-v0"
}
```

Idempotent if already locked with same facts → `200` same body.  
If facts changed after lock → `409` (force new SKU version in sustain; v0 may forbid mutate).

### `GET /v1/orgs/:orgId/classifications?cursor=&limit=`

Paginated locked routes. Auditor OK.

### Webhook `classification.locked`

HMAC-SHA256 body with shared secret. Payload = classify response + `org_id`.

## Required negatives (API tests, not just paper)

| Case | Expect |
|------|--------|
| tablet signal, no measured/retail | `400` or classify → `reject` |
| gri3_combination true | `reject` |
| note_1a true | `excluded_note_1a` |
| anon / wrong org | `401` / `403` |
| auditor POST classify | `403` |

## Forbidden product shapes

- Dual approver to “confirm HTS”
- Capacity / hold expiry / days ceiling as domain rule
- Claiming PPI Free/Free MFN savings in UI copy (see Challenge D / VALUE-STAKES)
