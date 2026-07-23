# Filing Penalty Desk — entity relationship doc (architect draft)

**Display name:** Filing Penalty Desk · **Slug:** `filing-penalty-desk`  
**Paper only. Draft.** Do not open `projects/filing-penalty-desk/` yet. Do not brand as `irc6651`.

Logical aggregates for a future build. Aligns with `filing-penalty-desk-COMPREHENSIVE-BLUEPRINT.md`, `filing-penalty-desk-PRD.md`, and legacy `irc6651-algorithm.md` (research inputs only).

---

## Aggregates (overview) — ≥4 durable

```text
Organization 1──* Member (role)
      │
      ├──* ReturnTimeline
      │         │
      │         ├──0..1 AdditionForecast (locked money line)
      │         │         └── optional MonthLineExplanation (embedded)
      │         │
      │         ├──0..1 ScenarioCompare (naive vs correct snapshot)
      │         └──* AuditEvent
      │
      ├──* AuditEvent (org-scoped)
      ├──  OrgSettings (tokens, webhook secret)
      └──  GoldensPack (read-mostly browser scope)
```

Inbound: `WebhookDelivery` (posts to webhook route; not a tenant page resource).

**Minimum durable aggregates for the bar:** Organization, ReturnTimeline, AdditionForecast, AuditEvent (+ Member / OrgSettings as supporting).

---

## 1. Organization

| Field | Notes |
|-------|-------|
| `orgId` | Tenant key; all app routes scoped by `:orgId` |
| name | Display — **Filing Penalty Desk** tenant label, never statute-code brand |
| created_at | |

**Owns:** members, return timelines, audit stream, settings, goldens browser scope.

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
| analyst | POST/PATCH timelines, POST forecast, POST batch, run scenario compare | Admin-only settings secrets |
| auditor | GET timelines, forecasts, audit, goldens, honesty | PATCH timelines; mutate forecast locks; settings secrets |
| admin | Settings GET/PATCH; membership | — |

---

## 3. ReturnTimeline

API resource shape: `/orgs/:orgId/returns` (+ `/:id`).

| Field | Notes |
|-------|-------|
| `id` | Return / timeline id |
| `orgId` | Tenant FK |
| `tax_year` / label | Catalog filter key |
| `net_amount_due` | FTF base after payment due date (fixed for the return) |
| `unpaid_by_month` | Array of unpaid tax at **start** of each month (FTP bases) |
| `unfiled_months` | Months (incl. partial) return is late for FTF accrual |
| `ftp_months` | Length of unpaid array / FTP accrual months |
| `levy_bump_after_month` | 0-based index; `null` = never |
| `min_floor` | Indexed >60-day minimum table amount; `0` if N/A |
| `apply_minimum` | true when >60 days late file |
| forecast status | Derived from presence of locked AdditionForecast |

**Relationships:** belongs to Organization; 0..1 locked AdditionForecast; 0..1 ScenarioCompare; many AuditEvents.

**Reject flags (must never lock as ok):** `flat_55_cheat`, `dual_approver_cheat`, `interest_as_penalty`, `installment_025_silent`.

---

## 4. AdditionForecast (locked statutory addition run)

Created by POST forecast (and batch equivalent). Lives on the return money line.

| Field | Notes |
|-------|-------|
| `returnId` | FK ReturnTimeline |
| `orgId` | Denormalized tenant |
| `status` | `ok` \| (reject does not lock) |
| `ftf` | Failure-to-file addition total |
| `ftp` | Failure-to-pay addition total |
| `combined` | FTF + FTP |
| `branch` | Explanation key (same-month reduction, cap, floor, levy bump, etc.) |
| `month_lines` | Optional embedded explanation rows |
| `algorithm_version` | e.g. `filing-penalty-desk-v0` (not `irc6651` in UI) |
| `locked_at` / `locked_by` | Actor + timestamp |

**Honesty:** no field that “finalizes IRS assessment.” Reject path returns reason and does not overwrite a prior good lock with a cheat.

---

## 5. ScenarioCompare (naive vs correct)

| Field | Notes |
|-------|-------|
| `returnId` | FK |
| `naive_total` | Flat / wrong-model dollars (labeled illustrative) |
| `correct_ftf` / `correct_ftp` / `correct_combined` | From AdditionForecast path |
| `delta_vs_naive` | Cash hidden or invented by spreadsheet |
| `compared_at` / actor | |

Not a dual-approval record — comparison only.

---

## 6. AuditEvent

| Field | Notes |
|-------|-------|
| `id` | Append-only |
| `orgId` | Tenant |
| `returnId` | Optional |
| `actor` | Subject |
| `action` | create / patch / forecast_lock / forecast_reject / scenario / export / webhook |
| `payload_summary` | Safe summary (no secret leakage) |
| `at` | Timestamp |

CSV export projects these rows.

---

## 7. OrgSettings

| Field | Notes |
|-------|-------|
| `orgId` | PK/FK |
| API tokens | Admin-managed |
| `webhook_secret` | HMAC |
| rate-limit policy notes | Documented; surfaced as UX feedback |

---

## 8. WebhookDelivery (inbound)

| Field | Notes |
|-------|-------|
| idempotency key | Dedup |
| HMAC signature | Required |
| payload → ReturnTimeline upsert | Analyst-equivalent create path |
| delivery status | accepted / reject |

---

## 9. GoldensPack (read-mostly)

Browser scope over paper fixtures (legacy paths `docs/ideas/fixtures/irc6651-*.json` until re-homed). UI labels use **Filing Penalty Desk** goldens — not statute-code brand chrome.

---

## Aggregate count vs bar

| Aggregate | Counts toward ≥4? |
|-----------|-------------------|
| Organization | yes |
| ReturnTimeline | yes |
| AdditionForecast | yes |
| AuditEvent | yes |
| Member / OrgSettings / ScenarioCompare / WebhookDelivery / GoldensPack | supporting / optional v1 |

---

## Explicit non-action

Draft ERD only. No schema migration, no `projects/` folder, no `ready_to_build` flip.
