# ptax4975 — entity relationship doc

**Paper only.** `current_idea` under hours hold. Do not open `projects/ptax4975/` until `FLIP_PATH_READY`.

Logical aggregates for a future build. Aligns with `ptax4975-API-CONTRACT.md`, `ptax4975-COMPREHENSIVE-BLUEPRINT.md`, `ptax4975-algorithm.md`, `ptax4975-PAGE-SPECS.md`, `ptax4975-FMV-FENCE.md`, `ptax4975-TAXABLE-PERIOD-FENCE.md`. **No routes invented beyond the existing contract.**

---

## Aggregates (overview)

```text
Organization 1──* Member (role)
      │
      ├──* ProhibitedTransaction
      │         │
      │         ├──0..1 ExciseRunSnapshot (locked initial + additional + total)
      │         │
      │         └──* AuditEvent
      │
      ├──* AuditEvent (org-scoped)
      ├──  Settings (tokens, webhook secret)
      └──  GoldensPack (read-mostly § 4975-shaped fixtures)
```

Inbound: `WebhookDelivery` (not a tenant page resource; posts to `/webhooks/transactions`).

Read models (not separate writable aggregates): goldens browser, honesty page.

---

## 1. Organization

| Field | Notes |
|-------|-------|
| `orgId` | Tenant key; all app routes scoped by `:orgId` |
| name | Display |
| created_at | |

**Owns:** members, prohibited transactions, audit stream, settings, goldens browser scope.

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
| analyst | POST/PATCH transactions, POST forecast, POST batch | Admin-only settings secrets |
| auditor | GET transactions, audit, goldens | PATCH transactions; POST forecast-as-mutate; settings secrets |
| admin | Settings GET/PATCH; membership | — |

Matches PAGE-SPECS RBAC and API-CONTRACT.

---

## 3. ProhibitedTransaction

API resource: `/orgs/:orgId/transactions` (+ `/:id`). Blueprint name: prohibited-transaction fact set.

| Field | Notes |
|-------|-------|
| `id` | Transaction id |
| `orgId` | Tenant FK |
| `amount_involved` | Dollars (may be overridden by greater-of FMV on forecast) |
| `fmv_a` / `fmv_b` | Optional FMV pair for greater-of toys |
| `year_parts` | Years or part-years in taxable period (≥ 1; fractional allowed in v0 toys) |
| `corrected` | boolean — true if corrected within correction period |
| forecast status | Derived from presence of locked ExciseRunSnapshot |

**Relationships:** belongs to Organization; 0..1 locked ExciseRunSnapshot; many AuditEvents.

Cheat flags (`flat_excise_cheat`, `dual_approver_cheat`, `understate_amount`, `use_fmv_greater_of`) are forecast-request inputs (or ephemeral), not durable happy-path fields that invent alternate locks — rejects do not lock.

---

## 4. ExciseRunSnapshot (locked money line)

Created/updated by `POST /orgs/:orgId/transactions/:id/forecast` (and batch equivalent). Not a separate public collection in the contract — lives on the transaction money line / audit detail.

| Field | Notes |
|-------|-------|
| `transactionId` | FK ProhibitedTransaction |
| `orgId` | Denormalized tenant |
| `status` | `ok` \| (reject does not lock) |
| `initial_tax` | 0.15 × amount × year_parts |
| `additional_tax` | 0 if corrected, else amount |
| `total` | initial + additional |
| `algorithm_version` | e.g. `ptax4975-v0` |
| `locked_at` | Timestamp |
| `locked_by` | Actor |

**Honesty:** no field that “files Form 5330.” Reject path returns reason and does **not** overwrite a prior good lock with a cheat.

**Reject rules (no lock):** `flat_excise_cheat`; `dual_approver_cheat`; greater-of understate; non-positive / non-finite amount or year_parts.

---

## 5. AuditEvent

API: `GET /orgs/:orgId/audit` (+ CSV export).

| Field | Notes |
|-------|-------|
| `orgId` | |
| `transactionId` | Optional |
| `actor` | Subject |
| `action` | create, recalc, cheat reject, … |
| `reason` | When reject (e.g. `flat_excise_cheat`, `dual_approver_cheat`, `greater_of_cheat`) |
| `payload` / summary | Enough to explain amount / year-parts / corrected / FMV choices |
| `at` | Timestamp |

Append-only. Auditor/admin export; no PATCH of history.

---

## 6. Settings

API: `GET/PATCH /orgs/:orgId/settings` (admin).

| Field | Notes |
|-------|-------|
| API tokens | Bearer issuance for integrations |
| webhook HMAC secret | Verifies `POST /webhooks/transactions` |
| members list | Role assignment |

---

## 7. GoldensPack (read-mostly)

Read-mostly § 4975-shaped fixture cards for education and sustain — **not** a mutate endpoint. Goldens browser: `GET /orgs/:orgId/goldens` (fixture status vs live engine).

---

## 8. WebhookDelivery (inbound)

API: `POST /webhooks/transactions` only.

| Field | Notes |
|-------|-------|
| HMAC signature | Required |
| idempotency key | Required for safe retries |
| payload | ERP-ish PT push → upsert ProhibitedTransaction in org |

Not dual-approver; not a Form 5330 filing channel.

---

## Read models (API-aligned)

| Route / page | Meaning |
|--------------|---------|
| Transaction detail tier breakdown | Embedded in forecast lock / GET transaction — initial + additional + total |
| `GET /orgs/:orgId/goldens` | Fixture cards vs live engine |
| Honesty page | Flat once ≠ year-parts; Kill A; v0 greater-of ≠ highest-FMV-during-period |

---

## Relationship rules (skeptical)

1. **Tenant wall:** every transaction, snapshot, audit row carries `orgId`; queries never leak across orgs.
2. **Money line authority:** only forecast POST locks ExciseRunSnapshot; PATCH of facts by auditor forbidden.
3. **Tiers are not optional theater:** ok locks must encode initial and additional separately — not a single mystery “excise” number without breakdown.
4. **Cheat reject ≠ alternate answer:** flat-once / dual-approver / understate return reject reasons, not a locked understatement.
5. **Batch:** `POST /orgs/:orgId/batch/forecast` with PT id array — each ProhibitedTransaction accrues independently (no shared mutable tax table mid-batch).
6. **FMV fence:** v0 greater-of two inputs only until a versioned dual suite flips (`ptax4975-FMV-FENCE.md`).

---

## API alignment checklist (do not contradict)

| Contract route | Aggregate touch |
|----------------|-----------------|
| `GET/POST /orgs/:orgId/transactions` | ProhibitedTransaction |
| `GET/PATCH /orgs/:orgId/transactions/:id` | ProhibitedTransaction |
| `POST .../transactions/:id/forecast` | ExciseRunSnapshot |
| `POST /orgs/:orgId/batch/forecast` | many ExciseRunSnapshots |
| `GET /orgs/:orgId/audit` | AuditEvent |
| `GET /orgs/:orgId/goldens` | GoldensPack / fixture status |
| `GET/PATCH /orgs/:orgId/settings` | Settings |
| `POST /webhooks/transactions` | WebhookDelivery → ProhibitedTransaction |

No extra “file Form 5330” or “approve/approve” routes.

---

## Explicit non-action

Paper ERD only. Do not open `projects/ptax4975/` or migrate schemas from this doc until `FLIP_PATH_READY`.
