# htsroute — page wireframe specs (pre-build)

**Status:** paper only. Expands `htsroute-COMPREHENSIVE-BLUEPRINT.md` into per-page UI contracts.  
**Bar:** `docs/COMPREHENSIVE_PRODUCT.md`  
**API shapes:** `htsroute-API-CONTRACT.md`  
**Framing:** `htsroute-PRODUCT-FRAMING.md` (Kill A + Free/Free honesty)  
**Explicit non-action:** do **not** open `projects/htsroute/` until day-boundary `ready_to_build`.

These specs define what each of the **7 pages** must show and prove. They are not implementation tickets.

---

## Shared UI rules (all pages)

| Rule | Spec |
|------|------|
| Auth | Bearer session; unauthenticated → redirect `/login` or `401` shell |
| Tenant | Org switcher in chrome; all data scoped to `orgId` |
| RBAC | Analyst: create/edit/classify/batch. Auditor: read catalog, detail (locked), audit, goldens. Admin: settings + audit export. |
| Forbidden chrome | No dual-approver buttons; no duty-savings badges on PPI pairs; no molecule-name classify field |
| Kill A footer | Every authenticated page shows: “Existing tools and brokers already do this commercially. This product is a method/workflow experiment.” |
| Money honesty | Any route result that surfaces MFN context must follow `htsroute-VALUE-STAKES.md` + `htsroute-STACKED-TARIFF-FENCE.md` (base MFN caveats OK; PPI Free/Free savings fail; no 232/301 dollar claims without annex cites) |

---

## Feature × page matrix

| Feature | 1 Catalog | 2 SKU detail | 3 Batch | 4 Audit | 5 Goldens | 6 Org settings | 7 Money honesty |
|---------|:---------:|:------------:|:-------:|:-------:|:---------:|:--------------:|:---------------:|
| List / filter SKUs | ● | | | | | | |
| Edit SKU fact card | | ● | | | | | |
| Classify (routeSku) + consistency rejects | | ● | ○ queue | | | | |
| Locked route + algorithm version + cites | ○ col | ● | ○ result | ○ event | ○ vs live | | |
| Batch upload / concurrent independent runs | | | ● | | | | |
| Audit trail filter | | ○ SKU | | ● | | | |
| Audit CSV export | | | | ● | | | |
| Goldens browser + pass/fail vs live | | | | | ● | | |
| Bearer auth + RBAC | ● | ● | ● | ● | ● | ● | ○ public OK |
| Org members / roles | | | | | | ● | |
| API tokens | | | | | | ● | |
| Webhook endpoint + HMAC secret | | | | | | ● | |
| Pagination | ● | | ○ jobs | ● | ○ fixtures | | |
| Money honesty education (PPI Free/Free + base-MFN caveats + 232 out-of-scope) | | ○ link | | | ○ link | | ● |
| Dual-impl parity (sustain CI; not a page) | | | | | ○ live A/B | | |

Legend: **●** primary surface · **○** secondary / linked · blank = not on that page.

---

## Page 1 — Catalog

### Route path

`/orgs/:orgId/skus`

### Purpose

List and filter SKU fact cards by route, lock status, and form signals. Entry point for analysts and auditors.

### Primary actions

| Action | Role | Behavior |
|--------|------|----------|
| Create SKU | analyst | Opens create draft → navigates to detail (draft) |
| Filter | analyst, auditor | Query params: `route`, `status` (`draft` \| `locked` \| `rejected`), `dosage_form_signal`, `chemical_form`, free-text label |
| Clear filters | analyst, auditor | Reset to default page |
| Open SKU | analyst, auditor | Navigate to Page 2 |
| Next / prev page | analyst, auditor | Cursor pagination (`cursor`, `limit`, default 25) |

### Data fields shown

| Column / chip | Source |
|---------------|--------|
| Label (optional display name; **not** a classify input) | SKU |
| `sku_id` | SKU |
| Status | `draft` / `locked` / `reject` / `excluded_note_1a` |
| Locked route | `chapter_29_chemical` \| `heading_3003_bulk_medicament` \| `heading_3004_medicament` \| `excluded_note_1a` \| `reject` \| — |
| `chemical_form` | fact card |
| `dosage_form_signal` | fact card |
| Therapeutic | boolean chip |
| Measured dose / retail packing | boolean chips |
| `locked_at` | classification (if locked) |
| `algorithm_version` | classification (if locked) |
| Updated | SKU `updated_at` |

### Empty / error states

| State | UI |
|-------|-----|
| Empty org (no SKUs) | “No SKUs yet.” CTA: Create SKU (analyst only). Auditor sees read-only empty copy. |
| Filters match nothing | “No SKUs match these filters.” CTA: Clear filters. |
| `401` / `403` | Auth shell; no data leak across orgs |
| List API failure | Inline error + Retry; table remains empty |

### Acceptance checks (this page)

1. Analyst sees Create; auditor does **not**.
2. Filters by route `heading_3003_bulk_medicament` and status `locked` return only matching rows.
3. Pagination: with >`limit` SKUs, next page advances cursor; no duplicate `sku_id` across pages.
4. Table never shows a molecule-name column used for routing; label is display-only.
5. Opening a row lands on `/orgs/:orgId/skus/:skuId`.
6. Kill A footer present.

---

## Page 2 — SKU detail

### Route path

`/orgs/:orgId/skus/:skuId`

### Purpose

Edit form/mixing facts, run classify, inspect locked route + optional ruling cites. Core unique-claim surface.

### Primary actions

| Action | Role | Behavior |
|--------|------|----------|
| Save facts | analyst | `PATCH`/`PUT` draft facts; reject unknown enums `400` |
| Classify | analyst | `POST .../classify` → lock route + version + timestamp |
| Copy route / cite pack | analyst, auditor | Clipboard of locked payload |
| View audit for SKU | auditor, admin | Deep-link to Page 4 filtered by `sku_id` |
| Open money honesty | all | Link to Page 7 when MFN context is shown |

Auditor: read-only facts + locked result; **no** Save / Classify.

### Data fields shown

**Fact card (editable when draft + analyst)**

| Field | Type / enums |
|-------|----------------|
| Label (optional) | string — never sent as routing input |
| `chemical_form` | `separately_defined` \| `mixture` \| `unknown` |
| `therapeutic_or_prophylactic` | boolean |
| `measured_dose` | boolean |
| `retail_packing` | boolean |
| `dosage_form_signal` | `bulk_drum` \| `bulk_pellets` \| `tablet` \| `capsule` \| `injectable_vial` \| `transdermal` \| `powder_bulk` \| `other` \| `unknown` |
| `note_1a_food_or_supplement` | boolean |
| `gri3_combination` | boolean |

**Classification result (after lock or reject)**

| Field | Notes |
|-------|-------|
| `route` | Per algorithm family |
| `locked_at` | ISO-8601 |
| `algorithm_version` | e.g. `htsroute-v0` |
| Actor | Who classified |
| Consistency message | Human-readable reject reason (tablet cheat, bulk+measured, Note 1(a), GRI3, insufficient facts) |
| Ruling cite pack (optional) | CROSS ids linked to goldens (read-mostly) |

**Explicitly absent:** `molecule_name` as a classify control (may appear only as non-routing label).

### Empty / error states

| State | UI |
|-------|-----|
| SKU not found | `404` page within org shell |
| Draft never classified | Result panel: “Not classified yet.” CTA: Classify (analyst) |
| Classify → `reject` / `excluded_note_1a` | Result panel shows route family + reason; not a silent 3004 |
| Classify → `400` (bad enum) | Field-level error; no lock |
| Classify → `409` (facts changed after lock) | “Locked classification conflicts with edited facts.” Sustain: force new SKU version; v0 may forbid mutate |
| Auditor Classify | Control hidden or `403` if forced |
| Cross-org `skuId` | `403` / `404` |

### Acceptance checks (this page)

1. Therapeutic bulk separately-defined → lock `chapter_29_chemical`.
2. Therapeutic mixture, no measured/retail, pellets → `heading_3003_bulk_medicament`.
3. Therapeutic + measured/retail + dose form → `heading_3004_medicament`.
4. Tablet enum without measured/retail → reject (not 3004).
5. `gri3_combination` → reject; `note_1a` → `excluded_note_1a`.
6. Idempotent re-classify with same facts → `200` same body.
7. Auditor cannot classify (`403` or control absent).
8. No molecule-name input on the classify form.
9. Locked panel shows `algorithm_version` + `locked_at`.
10. Kill A footer present; no PPI duty-savings copy on pantoprazole showcase SKUs.

---

## Page 3 — Batch classify

### Route path

`/orgs/:orgId/batches`  
Create/detail: `/orgs/:orgId/batches/:batchId`

### Purpose

Upload or queue multiple SKUs; run concurrent independent classifications. Proves batch + concurrency independence (not a single calculator).

### Primary actions

| Action | Role | Behavior |
|--------|------|----------|
| Upload CSV / JSON lines | analyst | Creates draft SKUs + batch job |
| Start batch | analyst | Enqueues classify for each eligible draft |
| Cancel / retry failed rows | analyst | Per-row retry; no dual-approver |
| Open SKU from row | analyst, auditor | Link to Page 2 |
| Refresh job status | analyst, auditor | Poll until terminal |

Auditor: view completed batches only; no upload/start.

### Data fields shown

**Batch header**

| Field | Notes |
|-------|-------|
| `batch_id` | |
| Status | `queued` \| `running` \| `completed` \| `failed` \| `partial` |
| Created by / at | actor + timestamp |
| Totals | queued / succeeded / rejected / failed |

**Per-row**

| Field | Notes |
|-------|-------|
| Row index / source line | |
| `sku_id` | After create |
| Fact summary | chemical_form, dosage_form_signal, therapeutic, measured, retail, note_1a, gri3 |
| Row status | pending / locked / reject / error |
| `route` | When done |
| `algorithm_version` | When done |
| Error message | Enum / auth / consistency |

### Empty / error states

| State | UI |
|-------|-----|
| No batches | “No batch jobs yet.” CTA: Upload (analyst) |
| Empty file / zero valid rows | “Nothing to classify.” Stay on upload |
| Partial row parse errors | Table of line errors; valid rows still queue |
| Concurrent run in progress | Progress bar; rows update independently |
| All rows fail authz | Batch `failed`; no locks written |
| Cross-SKU contamination | Acceptance fail if two concurrent SKUs share lock state incorrectly |

### Acceptance checks (this page)

1. Two-SKU concurrent batch: each locks independently (fixture theme `htsroute-21`).
2. One row’s reject does not roll back the other’s lock.
3. Auditor cannot start batch.
4. Upload rejects unknown enums per row without inventing routes.
5. Batch result never claims duty savings.
6. Kill A footer present.

---

## Page 4 — Audit log

### Route path

`/orgs/:orgId/audit`

### Purpose

Append-only trail of creates / classifies / override-rejects. Filter and export for auditors and admins.

### Primary actions

| Action | Role | Behavior |
|--------|------|----------|
| Filter | auditor, admin | `sku_id`, `actor`, `route`, `event_type`, date range |
| Export CSV | auditor, admin | Download filtered set (paginated export or async file) |
| Open SKU | auditor, admin | Link to Page 2 |
| Clear filters | auditor, admin | Reset |

Analyst: optional read of own-org events if product grants it; **export** is auditor/admin.

### Data fields shown

| Column | Notes |
|--------|-------|
| `event_id` | |
| `occurred_at` | ISO-8601 |
| `event_type` | `sku.created` \| `sku.updated` \| `classification.locked` \| `classification.rejected` \| `batch.started` \| `batch.completed` \| `webhook.received` \| `member.*` |
| `actor_id` / role | |
| `sku_id` | Nullable for org events |
| `route` | When classification-related |
| `algorithm_version` | When classification-related |
| Summary | Short human line (no marketing) |
| Request id / idempotency key | When from webhook |

### Empty / error states

| State | UI |
|-------|-----|
| No events | “No audit events yet.” |
| Filters empty | “No events match.” CTA: Clear filters |
| Export too large | Async job + download link; or 413 with guidance to narrow filters |
| `403` analyst without read | Denied shell |
| API failure | Inline error + Retry |

### Acceptance checks (this page)

1. Classify on Page 2 produces a `classification.locked` or reject event visible here within refresh.
2. Filter by `sku_id` returns only that SKU’s events.
3. Filter by actor returns only that actor.
4. CSV export includes timestamp, event_type, actor, sku_id, route, algorithm_version.
5. Events are append-only in UI (no edit/delete controls).
6. Pagination works for long trails.
7. Kill A footer present.

---

## Page 5 — Goldens / fixtures browser

### Route path

`/orgs/:orgId/goldens`  
Detail: `/orgs/:orgId/goldens/:fixtureId`

### Purpose

Read-only browser of paper goldens under `docs/ideas/fixtures/htsroute-*.json` with pass/fail vs the live product router. Auditor surface for method proof — not market proof.

### Primary actions

| Action | Role | Behavior |
|--------|------|----------|
| Filter by expected route / tag | auditor, admin, analyst (read) | e.g. 29 / 3003 / 3004 / Note 1(a) / reject |
| Run vs live | auditor, admin | Compare fixture expected route to live `routeSku` |
| Open fixture JSON | auditor, admin | Expand facts + expected |
| Link money honesty | all | For acetaminophen / PPI showcase fixtures |

No edit of fixture expected outcomes from the UI (fixtures stay paper-owned).

### Data fields shown

| Field | Notes |
|-------|-------|
| Fixture id / filename | e.g. `htsroute-10-pellets-3003` |
| Expected route | From fixture |
| Live route | From product router |
| Pass / fail | Match boolean |
| Fact summary | Same fact fields as SKU card |
| Linked CROSS ids | When present (e.g. NY N003244) |
| Algorithm version under test | |
| Dual-impl note (sustain) | Optional badge if A/B parity endpoint used in CI — not a second product |

### Empty / error states

| State | UI |
|-------|-----|
| Fixtures not loaded | “Goldens unavailable.” (misconfigured try/sustain mount) |
| Live router error | Row shows `error`; suite not silently green |
| Failures present | Banner: “N fixtures diverge from live router” — counts are method status, **not** celebrated as market proof |
| Unauthorized | `403` |

### Acceptance checks (this page)

1. All shipped paper goldens appear (≥42 files when sustain bar applies).
2. Pass/fail reflects live router vs fixture expected route.
3. Tablet-cheat fixture fails live if router wrongly returns 3004.
4. UI copy does **not** treat pass counts as “valuable product” or broker-beating proof.
5. Pantoprazole fixtures link or caption: Free/Free duty delta often zero (Page 7).
6. Kill A footer present.

---

## Page 6 — Org settings

### Route path

`/orgs/:orgId/settings`  
Tabs: `.../settings/members` · `.../settings/tokens` · `.../settings/webhooks`

### Purpose

Admin: members/roles, API bearer tokens, signed inbound webhook endpoint + secret. Encodes multi-tenant + integrate-phase authz.

### Primary actions

| Action | Role | Behavior |
|--------|------|----------|
| Invite / remove member | admin | Assign `analyst` \| `auditor` \| `admin` |
| Change role | admin | Immediate RBAC effect |
| Create / revoke token | admin | Bearer token once-visible on create |
| Rotate webhook secret | admin | New HMAC secret; old invalidated |
| Copy webhook URL | admin | Inbound supplier catalog push URL |
| Test webhook (optional) | admin | Signed ping with idempotency key |

Non-admin: `403` on entire settings tree.

### Data fields shown

**Members**

| Field | Notes |
|-------|-------|
| Email / name | |
| Role | analyst / auditor / admin |
| Status | active / invited / revoked |
| Joined at | |

**Tokens**

| Field | Notes |
|-------|-------|
| Token id / label | |
| Role scope | |
| Created / last used | |
| Secret | Shown once at create only |

**Webhooks**

| Field | Notes |
|-------|-------|
| Endpoint URL | Inbound |
| Events | e.g. `catalog.push` → create SKUs |
| HMAC algorithm | SHA-256 |
| Secret status | set / rotated_at (never full secret after create) |
| Last delivery | status + idempotency key |

### Empty / error states

| State | UI |
|-------|-----|
| Sole admin removal blocked | Error: cannot remove last admin |
| Token create failure | Inline error |
| Webhook signature mismatch (inbound) | Logged in audit; settings show last failure reason |
| Non-admin navigation | `403` |
| No tokens yet | Empty list + Create token |

### Acceptance checks (this page)

1. Admin-only access; analyst/auditor get `403`.
2. Role change: demoted analyst loses Classify on Page 2.
3. Bearer token authenticates API per contract; revoked token → `401`.
4. Webhook with valid HMAC + idempotency key creates SKU once; replay does not duplicate.
5. Invalid HMAC → reject; audit event recorded.
6. No dual-approver settings disguised as “compliance”.
7. Kill A footer present.

---

## Page 7 — Money honesty

### Route path

`/money-honesty` (org-agnostic education)  
Also linked as `/orgs/:orgId/money-honesty` for in-app chrome consistency.

### Purpose

Static education: PPI Free/Free vs encoded non-zero base MFN caveats, plus **stacked Section 232 / 301 out-of-scope** honesty. Required sustain page; copy is an acceptance oracle.

### Primary actions

| Action | Role | Behavior |
|--------|------|----------|
| Read sections | all (incl. logged-out OK) | Static content |
| Open cited fixtures | authenticated | Links to Page 5 ids `#26`–`#27` (PPI), `#32`–`#37` (analgesic deltas), `#40`–`#43` (same-letter dollar pairs) |
| Open stacked fence | all | Link to paper `htsroute-STACKED-TARIFF-FENCE.md` (or in-app mirror) |
| Back to catalog | authenticated | Navigate Page 1 |

No classify, no savings calculator, no “estimated duty saved” widget, no annex membership picker.

### Data fields shown (content blocks)

| Block | Must include |
|-------|----------------|
| Kill A | Brokers/tools exist; this is a method/workflow experiment |
| PPI showcase honesty | Pantoprazole / omeprazole bulk Chapter 29 and finished 3004 are often **both MFN Free** — **no duty-savings claim** |
| Honest contrast pairs | Acetaminophen / ibuprofen / aspirin; Eluxadoline–Viberzi; Vericiguat–Verquvo per VALUE-STAKES |
| Caveats | GSP / preference may zero bulk MFN by origin; cite “base MFN vs Free finished,” not guaranteed importer savings |
| Stacked duties fence | Letter base MFN is **not** landed-duty savings for **patented** covered goods once Section **232** / **301** stacks apply; primary dates: Annex III **2026-07-31**, other companies **2026-09-29**; **generics not subject at this time** — OTC analgesic teaching pairs ≠ 232 story; annexes not encoded in v0 |
| What the product does | Form/mixing gate 29 / 3003 / 3004 / Note 1(a) / reject — not full 10-digit HTS |
| Forbidden claims list | Beats brokers; PPI chapter-flip savings; fixture counts as market proof; invented 232 annex savings |

### Empty / error states

| State | UI |
|-------|-----|
| N/A empty | Static page always has content |
| Missing required disclaimer strings | **Hard fail** sustain acceptance (see checks) |
| Broken fixture deep-links | Soft warn; page still must show disclaimer copy |

### Acceptance checks (this page)

1. Visible copy states PPI Free/Free pairs are **not** a duty-savings pitch.
2. Acetaminophen (or peer) **6.5% → Free** appears only with preference/GSP caveat.
3. Kill A sentence present verbatim or equivalent.
4. No “beats brokers” / “replaces commercial HS engines” language.
5. No dual-approver or capacity-gate education framed as the domain rule.
6. Visible copy states stacked **232 / 301** dollars are out of scope / need annex cites (see STACKED-TARIFF-FENCE).
7. Playwright/HTML smoke: assert disclaimer substrings present (sustain).
8. Page is reachable from SKU detail / goldens when MFN context is shown.

---

## Critical path (UI smoke themes)

| # | Path | Must prove |
|---|------|------------|
| 1 | Login → Catalog → Create → Detail → Classify → lock 29/3003/3004 | Happy path |
| 2 | Detail tablet cheat → reject | Anti-keyword |
| 3 | Auditor Catalog → Detail (no classify) → Audit filter | RBAC |
| 4 | Batch two SKUs concurrent | Independence |
| 5 | Goldens run vs live | Fixture parity |
| 6 | Settings webhook signed push | Integrate |
| 7 | Money honesty copy assertions | Challenge D |

---

## Explicit non-actions

- Do not create `projects/htsroute/` from this doc.
- Do not ship a single-page calculator and call it sustain.
- Do not add dual-approver status gates as “domain.”
- Same-day build still blocked until `htsroute-DAY-BOUNDARY.md` passes on a **new calendar day**.
