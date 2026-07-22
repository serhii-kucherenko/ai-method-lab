# depositgap — entity relationship doc (seed paper)

**Paper only. Seed. Do not open `projects/depositgap/` yet.**

Logical aggregates for a future build. Aligns with `depositgap-API-CONTRACT.md`, `depositgap-COMPREHENSIVE-BLUEPRINT.md`, `depositgap-algorithm.md`, `depositgap-PAGE-SPECS.md`. **No routes invented beyond the existing contract.**

---

## Aggregates (overview)

```text
Organization 1──* Member (role)
      │
      ├──* DepositCase (entry / line)
      │         │
      │         ├──0..1 AssessmentTrueUp (locked forecast / money line)
      │         │         │
      │         │         └──1 InterestAccrual (embedded or child of true-up)
      │         │
      │         └──* AuditEvent
      │
      ├──* AuditEvent (org-scoped)
      ├──  Settings (tokens, webhook secret)
      └──  RateSourcePack (optional v1, read-mostly)
```

Inbound: `WebhookDelivery` (not a tenant page resource; posts to `/webhooks/entries`).

---

## 1. Organization

| Field | Notes |
|-------|-------|
| `orgId` | Tenant key; all app routes scoped by `:orgId` |
| name | Display |
| created_at | |

**Owns:** members, deposit cases, audit stream, settings, goldens browser scope.

**Auth boundary:** Bearer token must resolve to a membership in `orgId` or request is 401/403. No cross-tenant reads.

---

## 2. Member (org membership)

| Field | Notes |
|-------|-------|
| `orgId` | FK |
| `userId` / subject | From bearer |
| `role` | `analyst` \| `auditor` \| `admin` |

| Role | May | Must not |
|------|-----|----------|
| analyst | POST/PATCH entries, POST forecast, POST batch | Admin-only settings secrets |
| auditor | GET entries, cash-impact, audit, goldens | PATCH entries; POST forecast-as-mutate; settings secrets |
| admin | Settings GET/PATCH; membership | — |

Matches PAGE-SPECS RBAC and API-CONTRACT.

---

## 3. DepositCase (entry / line deposit)

API resource: `/orgs/:orgId/entries` (+ `/:id`).

| Field | Notes |
|-------|-------|
| `id` | Entry id |
| `orgId` | Tenant FK |
| `por` | Period of review (filter key) |
| `order_type` | `AD` \| `CVD` |
| `rate_class` | `exporter_specific` \| `all_others` \| `other` |
| `deposit_rate` | Decimal cash deposit at entry |
| `assessed_rate` | Final assessment rate (human-supplied; engine does not invent) |
| `entered_value` | USD customs value for the line |
| `order_published_on` | Interest window start (statute-shaped) |
| `liquidated_on` | Window end / forecast liquidation date |
| `interest_annual_rate` | § 6621 **stand-in** for whole window (`depositgap-6621-FENCE.md`) |
| exporter/producer assignment | Supports rate_class / filters |
| deposit paid (optional display) | Ops context; math uses rates × value |
| forecast status | Derived from presence of locked true-up |

**Relationships:** belongs to Organization; 0..1 locked AssessmentTrueUp; many AuditEvents.

---

## 4. AssessmentTrueUp (assessment event / locked forecast)

Created/updated by `POST /orgs/:orgId/entries/:id/forecast` (and batch equivalent). Not a separate public collection in the contract — lives on the entry money line.

| Field | Notes |
|-------|-------|
| `entryId` | FK DepositCase |
| `orgId` | Denormalized tenant |
| `status` | `ok` \| (reject does not lock) |
| `duty_delta` | `(assessed_rate − deposit_rate) × entered_value` |
| `days` | Calendar window per algorithm / fixtures |
| `interest` | From InterestAccrual |
| `true_up` | `duty_delta + interest` |
| `algorithm_version` | e.g. `depositgap-v0` |
| `locked_at` | Timestamp |
| `locked_by` | Actor |

**Honesty:** no field that “finalizes CBP liquidation.” Reject path returns reason and does **not** overwrite a prior good lock with a cheat (product must define lock semantics; contract: reject never invents rates).

---

## 5. InterestAccrual

Logical child of a successful AssessmentTrueUp (may be embedded in the forecast response).

| Field | Notes |
|-------|-------|
| window start/end | From `order_published_on` → `liquidated_on` |
| `interest_annual_rate` | Single-rate toy in v0 |
| `interest` | `duty_delta × rate × (days / 365)` per algorithm v0 |
| sign | Follows duty_delta (bill vs refund labeling) |

**Fence:** not a mid-window § 6621 series; not § 1505(d) delinquency.

**Reject rule:** `skip_interest=true` with `days > 0` → no accrual row; forecast rejects (422).

---

## 6. AuditEvent

API: `GET /orgs/:orgId/audit` (+ CSV export).

| Field | Notes |
|-------|-------|
| `orgId` | |
| `entryId` | Optional |
| `actor` | Subject |
| `action` | create, rate-class change, forecast lock, override reject, … |
| `rate_class` | When relevant |
| `payload` / summary | Enough to explain money line choices |
| `at` | Timestamp |

Append-only. Auditor/admin export; no PATCH of history.

---

## 7. Settings

API: `GET/PATCH /orgs/:orgId/settings` (admin).

| Field | Notes |
|-------|-------|
| API tokens | Bearer issuance for integrations |
| webhook HMAC secret | Verifies `POST /webhooks/entries` |
| members list | Role assignment |

---

## 8. RateSourcePack (optional v1)

Read-mostly cites (FR / I&D / liquidation instruction) linked for goldens education — **not** an invent-rates endpoint. Goldens browser: `GET /orgs/:orgId/goldens` (fixture status vs live engine).

---

## 9. WebhookDelivery (inbound)

API: `POST /webhooks/entries` only.

| Field | Notes |
|-------|-------|
| HMAC signature | Required |
| idempotency key | Required for safe retries |
| payload | ACE-ish entry deposit push → upsert DepositCase in org |

Not dual-approver; not a finalize-liquidation channel.

---

## Relationship rules (skeptical)

1. **Tenant wall:** every entry, true-up, audit row carries `orgId`; catalog/cash/audit queries never leak across orgs.
2. **Money line authority:** only forecast POST locks AssessmentTrueUp; PATCH of rates by auditor forbidden.
3. **Interest is not optional theater:** successful lock with days > 0 must include interest dollars; skip-interest cheats reject.
4. **Batch:** `POST /orgs/:orgId/batch/forecast` with entry id array — each DepositCase accrues independently (no shared mutable rate table mid-batch).
5. **Cash impact:** `GET /orgs/:orgId/cash-impact` is a **read model** over locked true-ups (POR rollup), not a separate writable aggregate.

---

## API alignment checklist (do not contradict)

| Contract route | Aggregate touch |
|----------------|-----------------|
| `GET/POST /orgs/:orgId/entries` | DepositCase |
| `GET/PATCH /orgs/:orgId/entries/:id` | DepositCase |
| `POST .../entries/:id/forecast` | AssessmentTrueUp + InterestAccrual |
| `POST /orgs/:orgId/batch/forecast` | many true-ups |
| `GET /orgs/:orgId/cash-impact` | read model |
| `GET /orgs/:orgId/audit` | AuditEvent |
| `GET /orgs/:orgId/goldens` | RateSourcePack / fixture status |
| `GET/PATCH /orgs/:orgId/settings` | Settings |
| `POST /webhooks/entries` | WebhookDelivery → DepositCase |

No extra “finalize liquidation” or “approve/approve” routes.

---

## Explicit non-action

Paper ERD only. Do not open `projects/depositgap/` or migrate schemas from this doc until activation after htsroute clears (`depositgap-POST-HTSROUTE-RUN.md`).
