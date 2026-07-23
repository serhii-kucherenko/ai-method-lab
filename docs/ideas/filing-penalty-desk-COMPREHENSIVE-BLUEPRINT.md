# Filing Penalty Desk — comprehensive product blueprint (architect draft)

**Display name:** Filing Penalty Desk  
**Slug:** `filing-penalty-desk`  
**Status:** paper only — **not** `ready_to_build`. Do **not** open `projects/filing-penalty-desk/`.  
**Bar:** `docs/COMPREHENSIVE_PRODUCT.md` + `docs/PRODUCT_NAMING.md` (Correction 6)  
**Legacy research id:** `irc6651` (internal kit only — **forbidden as public brand**)  
**Unique claim:** Month-by-month failure-to-file + failure-to-pay additions with same-month file reduction, net bases, optional levy-intent pay bump, aggregate caps, and minimum lesser-of floor — forecast/workflow honesty, not IRS/CPA replacement.

---

## Goal

A multi-page controller **cash-forecast desk** for late-file / late-pay tax additions — not a one-page flat late-fee calculator, not a dual-approver status board, not a statute-code costume product.

---

## Aggregates (≥4 durable)

| # | Aggregate | Why it exists |
|---|-----------|---------------|
| 1 | **Organization** | Multi-tenant boundary; members; settings |
| 2 | **ReturnTimeline** | Return facts: net due, unpaid-by-month, unfiled/FTP months, levy bump, min floor |
| 3 | **AdditionForecast** | Locked FTF / FTP / combined / branch / algorithm version |
| 4 | **AuditEvent** | Append-only trail of edits, locks, rejects, exports |
| 5 | **Member** (supporting) | Roles: admin / analyst / auditor |
| 6 | **OrgSettings** (supporting) | Tokens + webhook HMAC |
| 7 | **ScenarioCompare** (supporting) | Naive vs correct snapshot |
| 8 | **GoldensPack** (read-mostly) | Fixture browser scope |

**Bar check:** ≥4 durable aggregates satisfied (1–4).

---

## Pages (≥6 distinct views)

| # | Page | Route sketch | Purpose | Primary features |
|---|------|--------------|---------|------------------|
| 1 | **Returns catalog** | `/orgs/:orgId/returns` | List / search / filter / paginate timelines | 1, 3, 15 |
| 2 | **Timeline detail** | `/orgs/:orgId/returns/:id` | Edit facts; run statutory forecast; branch explanation | 4, 5, 6 |
| 3 | **Scenario compare** | `/orgs/:orgId/returns/:id/scenarios` | Naive flat-fee vs correct month-walk | 7 |
| 4 | **Batch forecast** | `/orgs/:orgId/batch` | Queue independent forecasts | 8, 16 |
| 5 | **Audit log** | `/orgs/:orgId/audit` | Filter + CSV export | 9, 10 |
| 6 | **Goldens browser** | `/orgs/:orgId/goldens` | Paper fixtures vs live engine | 11 |
| 7 | **Honesty / disclaimer** | `/orgs/:orgId/honesty` | Kill honesty: forecast ≠ IRS/CPA | 12 |
| 8 | **Org settings** | `/orgs/:orgId/settings` | Members, tokens, webhook secret | 2, 13, 14 |

**Bar check:** 8 pages (≥6). Offline try (feature 17) and in-app guide link (feature 18) are capabilities — try may live under `demos/` / product try artifact; guide link appears in-app by sustain.

---

## Feature matrix (≥15 user-visible) — **18 features**

CRUD create/read/update alone do **not** pad this list past the COMPREHENSIVE_PRODUCT cap. Dual-approval boards do **not** count.

| # | Feature | User-visible where | Aggregate(s) | Phase |
|---|---------|--------------------|--------------|-------|
| 1 | **Org tenancy** | All org-scoped pages; cross-org blocked | Organization | smoke/crud |
| 2 | **Member roles** (admin / analyst / auditor) | Settings + RBAC on mutate vs read | Member, Organization | crud |
| 3 | **Return / timeline catalog** | Returns catalog | ReturnTimeline | crud |
| 4 | **Timeline detail editor** | Timeline detail | ReturnTimeline | crud |
| 5 | **Statutory addition forecast** | Detail + batch; locked FTF/FTP/combined | AdditionForecast | smoke/crud |
| 6 | **Branch / line explanation** | Detail money panel | AdditionForecast | crud/workflow |
| 7 | **Scenario compare** (naive vs correct) | Scenario compare page | ScenarioCompare, AdditionForecast | workflow |
| 8 | **Batch forecast** | Batch page; independent runs | AdditionForecast | workflow |
| 9 | **Audit log** | Audit page | AuditEvent | workflow |
| 10 | **CSV export** | Audit (and optional catalog) export control | AuditEvent | workflow |
| 11 | **Goldens browser** | Goldens page | GoldensPack | sustain |
| 12 | **Honesty / disclaimer page** | Honesty page + digest language | — (static + PRODUCT) | crud |
| 13 | **Webhook inbound + HMAC** | Inbound API; delivery status in settings/audit | OrgSettings, ReturnTimeline | integrate |
| 14 | **Org webhook settings** | Org settings | OrgSettings | integrate |
| 15 | **Pagination + search/filter** | Catalog + audit | ReturnTimeline, AuditEvent | integrate |
| 16 | **Rate-limit feedback** | Batch / API error UX | — | integrate/scale |
| 17 | **Offline try page** | Try artifact demos unique claim | — | sustain |
| 18 | **In-app link to tutor guide** | Nav / honesty / help | — | sustain |

**Feature count for bar:** **18** (≥15 required).

### Feature → page coverage map

| Page | Features exercised |
|------|-------------------|
| Returns catalog | 1, 3, 15 |
| Timeline detail | 1, 2, 4, 5, 6 |
| Scenario compare | 7 |
| Batch forecast | 8, 16 |
| Audit log | 9, 10, 15 |
| Goldens browser | 11 |
| Honesty | 12, 18 |
| Org settings | 2, 13, 14 |
| Offline try (artifact) | 17 |

---

## Forbidden in build (when/if activated)

- Public product brand `irc6651` / § 6651 as the product name
- Dual-approver status gates as “domain”
- Flat late-fee percent widget shipping as sustain
- Collapsing FTF+FTP into one unlabeled “penalty” without breakdown
- Silent interest-as-penalty or installment 0.25% swap
- Single-page calculator as “sustain”
- Claims to replace IRS assessment, abatement, or CPA advice

---

## Phase plan (when build starts — not from this draft alone)

| Phase | Scope |
|-------|-------|
| smoke | Org + ReturnTimeline + AdditionForecast + ≥25 claim goldens |
| crud | Catalog + detail + honesty + RBAC |
| workflow | Scenario compare + batch + audit + CSV |
| integrate | Webhook + pagination/search + settings + rate-limit feedback |
| scale | Concurrent batch stress |
| sustain | All pages + goldens + dual-impl CI + offline try + tutor guide link |

---

## Test themes

- Same-month reduction: both FTF raw and FTP in a month → FTF reduced (not stacked full)
- Levy bump: months after index use 1% FTP vs 0.5%
- Minimum floor: >60-day path binds lesser-of floor
- Caps: FTF/FTP aggregate 25% story
- Negatives: flat-fee cheat, dual-approver cheat, interest-as-penalty, silent installment → reject
- UI critical path per page
- Honesty page asserts Kill copy; no `irc6651` brand chrome in UI strings
- ≥25 goldens + dual-impl CI at sustain

---

## Kill risks (carry forward)

| Kill | Note |
|------|------|
| A — incumbents | IRS notices + commercial tax software already assess. Survive only as **forecast / method honesty**. |
| B — niche | Controllers / tax leads at late filers — not mass consumer tax software. |
| C — offline | Abatement, CPA judgment, notice disputes stay offline. |
| Naming | Statute-code brand fails Correction 6 instantly. |

---

## Explicit non-action (this artifact)

- **Do not** flip `ready_to_build`.
- **Do not** open `projects/filing-penalty-desk/`.
- **Do not** treat legacy `irc6651*` paths as the product brand.
- PM-GO + controller depth clearance still required before build.
- This blueprint satisfies the **comprehensive bar shape** (≥15 features, ≥6 pages, ≥4 aggregates) — it does **not** by itself clear every IDEA_DEPTH / PM gate.
