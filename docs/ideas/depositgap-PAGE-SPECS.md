# depositgap — page wireframe specs (seed paper)

**Status:** seed only. Expands `depositgap-COMPREHENSIVE-BLUEPRINT.md`.  
**Bar:** `docs/COMPREHENSIVE_PRODUCT.md`  
**G6:** `depositgap-G6-summary.md`  
**Explicit non-action:** do **not** open `projects/depositgap/` while `htsroute` holds the slot.

---

## Shared UI rules

| Rule | Spec |
|------|------|
| Auth | Bearer session; unauthenticated → 401 / login |
| Tenant | Org-scoped entries and forecasts |
| RBAC | Analyst: mutate deposit facts + run forecast. Auditor: read-only + audit/goldens. Admin: settings. |
| Forbidden chrome | No dual-approver gates; no “replaces your broker / ACE” claims; no day-count-only widget without deposit vs assessed |
| Kill A footer | “Brokers and CBP still own liquidation. This is a forecast / method experiment.” |
| Money honesty | Surface duty_delta **and** interest separately; never hide § 1677g |

---

## Feature × page matrix

| Feature | 1 Catalog | 2 Detail | 3 Batch | 4 Cash impact | 5 Audit | 6 Goldens | 7 Settings | 8 Honesty |
|---------|:---------:|:--------:|:-------:|:-------------:|:-------:|:---------:|:----------:|:---------:|
| List / filter entries | ● | | | ○ | | | | |
| Edit deposit / assessed facts | | ● | | | | | | |
| Run true-up forecast | | ● | ○ queue | | | | | |
| Rate-class selection | | ● | ○ | | | | | |
| POR cash rollup | | | | ● | | | | |
| Batch concurrent runs | | | ● | | | | | |
| Audit trail / CSV | | ○ | | | ● | | | |
| Fixture browser | | | | | | ● | | |
| Org / tokens / webhook | | | | | | | ● | |
| Kill A + interest education | | ○ | | ○ | | ○ | | ● |

---

## Page briefs

### 1. Entries catalog — `/orgs/:orgId/entries`

Filter by POR, order type (AD/CVD), rate class, bill/refund sign, forecast status. Paginated.

### 2. Entry detail — `/orgs/:orgId/entries/:id`

Edit deposit rate, assessed rate, entered value, publication/liquidation dates, interest rate input, rate class. **Run forecast** locks a money line: duty_delta, days, interest, true_up, algorithm version. Auditor cannot mutate.

### 3. Batch forecast — `/orgs/:orgId/batch`

Upload/queue many entries; each run independent (no shared mutable rate mid-batch). Failures per line do not silently rewrite siblings.

### 4. Interest & cash impact — `/orgs/:orgId/cash-impact`

POR rollup: sum duty_delta, interest, true_up; filter by order / exporter class. Export CSV.

### 5. Audit log — `/orgs/:orgId/audit`

Append-only events: create, rate-class change, forecast lock, override reject. Auditor/admin export.

### 6. Goldens browser — `/orgs/:orgId/goldens`

Read-only `docs/ideas/fixtures/depositgap-*` cards vs live engine pass/fail.

### 7. Org settings — `/orgs/:orgId/settings`

Members, roles, API tokens, webhook HMAC secret.

### 8. Money honesty — `/orgs/:orgId/honesty` (or public `/honesty`)

Static copy: deposit ≠ final; interest compounds the miss; Kill A footer; link to illustrative $150k + interest toy — **not** a live liquidation.

---

## Critical-path proofs (when built)

| Page | Must prove |
|------|------------|
| Detail | Underdeposit toy matches fixture A before interest; interest line non-zero when days > 0 |
| Detail | `skip_interest` path rejected |
| Batch | Two entries → independent true_ups (Y) |
| Cash impact | Signed refund path visible for overdeposit |
| Honesty | Kill A sentence present in DOM |
| Goldens | ≥23 paper fixtures still green in CI |

## Explicit non-actions

No product folder. No activation today.
