# lesserof — entity relationship doc (seed paper)

**Paper only. Seed / research. Do not open `projects/lesserof/` yet.**

Logical aggregates for a future build. Aligns with `lesserof-API-CONTRACT.md`, `lesserof-COMPREHENSIVE-BLUEPRINT.md`, `lesserof-algorithm.md`, `lesserof-PAGE-SPECS.md`. **No routes invented beyond the existing contract.**

---

## Aggregates (overview)

```text
Organization 1──* Member (role)
      │
      ├──* ClaimLine
      │         │
      │         ├──0..1 StackedForecast (locked recoverable / money line)
      │         │         │
      │         │         ├── tftea_cap (embedded)
      │         │         └── usmca_cap (embedded; may be $0)
      │         │
      │         └──* AuditEvent
      │
      ├──* AuditEvent (org-scoped)
      ├──  Settings (tokens, webhook secret)
      └──  HtsDescriptionPack (optional v1, read-mostly basket labels)
```

Inbound: `WebhookDelivery` (not a tenant page resource; posts to `/webhooks/claim-lines`).

Read models (not separate writable aggregates): lane-compare, forecast-vs-actual, goldens browser.

---

## 1. Organization

| Field | Notes |
|-------|-------|
| `orgId` | Tenant key; all app routes scoped by `:orgId` |
| name | Display |
| created_at | |

**Owns:** members, claim lines, audit stream, settings, goldens browser scope.

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
| analyst | POST/PATCH claim-lines, POST forecast, POST batch | Admin-only settings secrets |
| auditor | GET claim-lines, forecast-vs-actual, audit, goldens, lane-compare | PATCH lines; POST forecast-as-mutate; settings secrets |
| admin | Settings GET/PATCH; membership | — |

Matches PAGE-SPECS RBAC and API-CONTRACT.

---

## 3. ClaimLine

API resource: `/orgs/:orgId/claim-lines` (+ `/:id`).

| Field | Notes |
|-------|-------|
| `id` | Line id |
| `orgId` | Tenant FK |
| `claim_basis` | `direct_id` \| `substitution` (fixtures may say `claim_type`) |
| `hts8` | 8-digit HTS |
| `hts10` | 10-digit statistical (required when basket trap applies) |
| `us_duty_paid` | U.S. duty attributable to the line (fixtures: `duties_paid`) |
| `substitute_duty_column` | TFTEA substitute basis dollars (fixtures: `substitute_basis`) |
| `export_destination` | `US` \| `CA` \| `MX` \| `other` |
| `usmca_export_duty` | Partner duty dollars; 0 if duty-free (fixtures: `usmca_partner_duty`) |
| `basket_other_flag` | 8-digit description class begins with “other” |
| forecast status | Derived from presence of locked StackedForecast |

**Relationships:** belongs to Organization; 0..1 locked StackedForecast; many AuditEvents.

---

## 4. StackedForecast (locked money line)

Created/updated by `POST /orgs/:orgId/claim-lines/:id/forecast` (and batch equivalent). Not a separate public collection in the contract — lives on the claim-line money line.

| Field | Notes |
|-------|-------|
| `claimLineId` | FK ClaimLine |
| `orgId` | Denormalized tenant |
| `status` | `ok` \| (reject does not lock) |
| `tftea_cap` | On substitution: 99% × min(paid, substitute); direct-ID path does not apply lesser-of |
| `usmca_cap` | After TFTEA when CA/MX; may be **0** (`lesserof-USMCA-WIPE-FENCE.md`) |
| `recoverable` | Stacked result (= usmca_cap on substitution CA/MX path; 99% paid on direct-ID) |
| `algorithm_version` | e.g. `lesserof-v0` |
| `locked_at` | Timestamp |
| `locked_by` | Actor |

**Honesty:** no field that “files ACE drawback.” Reject path returns reason and does **not** overwrite a prior good lock with a cheat.

**Reject rules (no lock):** lesser-of on direct-ID; skip lesser-of on substitution; basket other without match; USMCA without partner; USMCA on direct-ID; relabel cheat.

---

## 5. AuditEvent

API: `GET /orgs/:orgId/audit` (+ CSV export).

| Field | Notes |
|-------|-------|
| `orgId` | |
| `claimLineId` | Optional |
| `actor` | Subject |
| `action` | create, recalc, mode reject, eligibility reject, override deny, … |
| `reason` | When reject |
| `payload` / summary | Enough to explain stacked-cap choices |
| `at` | Timestamp |

Append-only. Auditor/admin export; no PATCH of history.

---

## 6. Settings

API: `GET/PATCH /orgs/:orgId/settings` (admin).

| Field | Notes |
|-------|-------|
| API tokens | Bearer issuance for integrations |
| webhook HMAC secret | Verifies `POST /webhooks/claim-lines` |
| members list | Role assignment |

---

## 7. HtsDescriptionPack (optional v1)

Read-mostly “other” / non-“other” labels for basket goldens education — **not** a silent-match endpoint. Goldens browser: `GET /orgs/:orgId/goldens` (fixture status vs live engine).

---

## 8. WebhookDelivery (inbound)

API: `POST /webhooks/claim-lines` only.

| Field | Notes |
|-------|-------|
| HMAC signature | Required |
| idempotency key | Required for safe retries |
| payload | ERP-ish claim-line push → upsert ClaimLine in org |

Not dual-approver; not a file-ACE channel.

---

## Read models (API-aligned)

| Route | Meaning |
|-------|---------|
| `GET .../claim-lines/:id/lane-compare` | Direct-ID vs substitution on shared paid amount — proves lesser-of must not apply to direct-ID |
| `GET /orgs/:orgId/forecast-vs-actual` | Naive / TFTEA-only / stacked / reject dollar deltas |
| `GET /orgs/:orgId/goldens` | Fixture cards vs live engine |

---

## Relationship rules (skeptical)

1. **Tenant wall:** every claim line, forecast, audit row carries `orgId`; queries never leak across orgs.
2. **Money line authority:** only forecast POST locks StackedForecast; PATCH of facts by auditor forbidden.
3. **USMCA wipe is not optional theater:** CA/MX duty-free must lock recoverable **0** when path is valid; missing partner rejects instead of silent zero.
4. **Basket ineligible ≠ $0 lesser-of:** reject reason must be eligibility, not a fake stacked cap of zero from lesser-of math.
5. **Batch:** `POST /orgs/:orgId/batch/forecast` with line id array — each ClaimLine accrues independently (no shared mutable cap table mid-batch).
6. **Forecast-vs-actual:** read model over locked forecasts + naive counters — not a separate writable aggregate.

---

## API alignment checklist (do not contradict)

| Contract route | Aggregate touch |
|----------------|-----------------|
| `GET/POST /orgs/:orgId/claim-lines` | ClaimLine |
| `GET/PATCH /orgs/:orgId/claim-lines/:id` | ClaimLine |
| `POST .../claim-lines/:id/forecast` | StackedForecast |
| `GET .../claim-lines/:id/lane-compare` | read model |
| `POST /orgs/:orgId/batch/forecast` | many StackedForecasts |
| `GET /orgs/:orgId/forecast-vs-actual` | read model |
| `GET /orgs/:orgId/audit` | AuditEvent |
| `GET /orgs/:orgId/goldens` | HtsDescriptionPack / fixture status |
| `GET/PATCH /orgs/:orgId/settings` | Settings |
| `POST /webhooks/claim-lines` | WebhookDelivery → ClaimLine |

No extra “file ACE” or “approve/approve” routes.

---

## Explicit non-action

Paper ERD only. Do not open `projects/lesserof/` or migrate schemas from this doc until hours + ticks clear and G6 stays honest (`lesserof-POST-DEPOSITGAP-STATUS.md`).
