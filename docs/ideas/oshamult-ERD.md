# oshamult — entity relationship doc

**Paper only. Parallel seed. Do not open `projects/oshamult/` until activation queue clears.**  
**Do not set `current_idea` to oshamult** — `lesserof` holds the research slot (hours hold).

Logical aggregates for a future build. Aligns with `oshamult-API-CONTRACT.md`, `oshamult-COMPREHENSIVE-BLUEPRINT.md`, `oshamult-algorithm.md`, `oshamult-PAGE-SPECS.md`, `oshamult-SERIAL-FENCE.md`. **No routes invented beyond the existing contract.**

---

## Aggregates (overview)

```text
Organization 1──* Member (role)
      │
      ├──* Citation
      │         │
      │         ├──0..1 PenaltyRunSnapshot (locked proposed penalty + step balances)
      │         │
      │         └──* AuditEvent
      │
      ├──* AuditEvent (org-scoped)
      ├──  Settings (tokens, webhook secret)
      └──  GoldensPack (read-mostly FOM-shaped fixtures)
```

Inbound: `WebhookDelivery` (not a tenant page resource; posts to `/webhooks/citations`).

Read models (not separate writable aggregates): goldens browser, honesty page.

---

## 1. Organization

| Field | Notes |
|-------|-------|
| `orgId` | Tenant key; all app routes scoped by `:orgId` |
| name | Display |
| created_at | |

**Owns:** members, citations, audit stream, settings, goldens browser scope.

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
| analyst | POST/PATCH citations, POST forecast, POST batch | Admin-only settings secrets |
| auditor | GET citations, audit, goldens | PATCH citations; POST forecast-as-mutate; settings secrets |
| admin | Settings GET/PATCH; membership | — |

Matches PAGE-SPECS RBAC and API-CONTRACT.

---

## 3. Citation

API resource: `/orgs/:orgId/citations` (+ `/:id`).

| Field | Notes |
|-------|-------|
| `id` | Citation id |
| `orgId` | Tenant FK |
| `classification` | `serious` \| `other` \| `willful` \| `repeat` \| `fta` |
| `gravity_tier` | `low` \| `moderate` \| `high` (Quick Fix gate for serious) |
| `gbp_amount` | Gravity-based penalty dollars |
| `size_pct` | 0–1 size reduction (caller supplies from FOM size table) |
| `history_pct` | 0–1 history reduction |
| `good_faith_pct` | 0–1 good-faith reduction |
| `quick_fix_pct` | 0–1 Quick Fix reduction |
| forecast status | Derived from presence of locked PenaltyRunSnapshot |

**Relationships:** belongs to Organization; 0..1 locked PenaltyRunSnapshot; many AuditEvents.

Cheat flags (`use_statutory_max`, `additive_cheat`) are forecast-request inputs, not durable happy-path fields — rejects do not lock.

---

## 4. PenaltyRunSnapshot (locked money line)

Created/updated by `POST /orgs/:orgId/citations/:id/forecast` (and batch equivalent). Not a separate public collection in the contract — lives on the citation money line / audit detail.

| Field | Notes |
|-------|-------|
| `citationId` | FK Citation |
| `orgId` | Denormalized tenant |
| `status` | `ok` \| (reject does not lock) |
| `penalty` | Final proposed penalty after serial steps |
| `steps` | Remaining balances after Size, History, Good Faith, Quick Fix (v0 order) |
| `algorithm_version` | e.g. `oshamult-v0` |
| `locked_at` | Timestamp |
| `locked_by` | Actor |

**Honesty:** no field that “issues an OSHA citation.” Reject path returns reason and does **not** overwrite a prior good lock with a cheat.

**Reject rules (no lock):** `use_statutory_max`; `additive_cheat`; size on willful/repeat; good faith on willful/repeat/FTA; Quick Fix on ineligible class / high-gravity serious; invalid GBP or pct ranges.

---

## 5. AuditEvent

API: `GET /orgs/:orgId/audit` (+ CSV export).

| Field | Notes |
|-------|-------|
| `orgId` | |
| `citationId` | Optional |
| `actor` | Subject |
| `action` | create, recalc, gate reject, cheat reject, … |
| `reason` | When reject (e.g. `size_on_willful_or_repeat`, `statutory_max`, `additive_cheat`, `quick_fix_ineligible`) |
| `payload` / summary | Enough to explain serial steps / gate choices |
| `at` | Timestamp |

Append-only. Auditor/admin export; no PATCH of history.

---

## 6. Settings

API: `GET/PATCH /orgs/:orgId/settings` (admin).

| Field | Notes |
|-------|-------|
| API tokens | Bearer issuance for integrations |
| webhook HMAC secret | Verifies `POST /webhooks/citations` |
| members list | Role assignment |

---

## 7. GoldensPack (read-mostly)

Read-mostly FOM-shaped fixture cards for education and sustain — **not** a mutate endpoint. Goldens browser: `GET /orgs/:orgId/goldens` (fixture status vs live engine).

---

## 8. WebhookDelivery (inbound)

API: `POST /webhooks/citations` only.

| Field | Notes |
|-------|-------|
| HMAC signature | Required |
| idempotency key | Required for safe retries |
| payload | ERP-ish citation push → upsert Citation in org |

Not dual-approver; not an issue-citation channel.

---

## Read models (API-aligned)

| Route / page | Meaning |
|--------------|---------|
| Citation detail serial steps | Embedded in forecast lock / GET citation — remaining balances per step |
| `GET /orgs/:orgId/goldens` | Fixture cards vs live engine |
| Honesty page | Statutory max ≠ GBP; serial ≠ additive; Kill A; v0 order ≠ live FOM HTML |

---

## Relationship rules (skeptical)

1. **Tenant wall:** every citation, snapshot, audit row carries `orgId`; queries never leak across orgs.
2. **Money line authority:** only forecast POST locks PenaltyRunSnapshot; PATCH of facts by auditor forbidden.
3. **Serial is not optional theater:** ok locks must encode remaining-balance steps — not a single mystery “discounted” number without breakdown.
4. **Classification reject ≠ silent $0:** ineligible reductions return reject reasons, not a fake serial path that zeros the factor quietly when pct > 0 was requested.
5. **Batch:** `POST /orgs/:orgId/batch/forecast` with citation id array — each Citation accrues independently (no shared mutable penalty table mid-batch).
6. **Order lock:** v0 steps follow Size→History→Good Faith→Quick Fix until a versioned dual suite flips (`oshamult-SIZE-TABLE.md`).

---

## API alignment checklist (do not contradict)

| Contract route | Aggregate touch |
|----------------|-----------------|
| `GET/POST /orgs/:orgId/citations` | Citation |
| `GET/PATCH /orgs/:orgId/citations/:id` | Citation |
| `POST .../citations/:id/forecast` | PenaltyRunSnapshot |
| `POST /orgs/:orgId/batch/forecast` | many PenaltyRunSnapshots |
| `GET /orgs/:orgId/audit` | AuditEvent |
| `GET /orgs/:orgId/goldens` | GoldensPack / fixture status |
| `GET/PATCH /orgs/:orgId/settings` | Settings |
| `POST /webhooks/citations` | WebhookDelivery → Citation |

No extra “issue OSHA citation” or “approve/approve” routes.

---

## Explicit non-action

Paper ERD only. Do not open `projects/oshamult/` or migrate schemas from this doc. Do not flip `current_idea` to oshamult while lesserof holds hours (`oshamult-POST-LESSEROF-RUN.md`).
