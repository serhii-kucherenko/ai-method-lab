# htsroute — sustain test matrix (paper)

**Status:** docs only until day-boundary `ready_to_build` and `projects/htsroute/` exists.  
**Bar:** `docs/COMPREHENSIVE_PRODUCT.md` + `htsroute-ACCEPTANCE.md` + `htsroute-COMPREHENSIVE-BLUEPRINT.md`  
**Workflow:** A03 test-first (`docs/DEVELOPMENT_WORKFLOW.md`) — RED suites before GREEN pages.

This matrix is the **sustain-phase exit plan** for the multi-page product. Vanity fixture counts alone never pass. Dual-impl drift fails the phase.

---

## Target

| Metric | Floor | Notes |
|--------|------:|-------|
| **Total automated tests at sustain** | **≥60** | Unique-claim goldens + API + UI + RBAC + webhook + concurrency + copy + dual-impl |
| Unique-claim goldens | **≥40** | All `docs/ideas/fixtures/htsroute-*.json` green in product runner |
| Pages with critical-path coverage | **7** | Catalog, SKU detail, Batch, Audit, Goldens browser, Org settings, Money honesty |
| Dual-impl CI jobs | **2** green | `check-htsroute-fixtures.mjs` + `check-htsroute-dual.mjs` (or product-ported equivalents) |

**Estimated sustain suite size: ~70 tests** (see §Rollup). Stretch to ~75 if Playwright E2E splits page paths into separate cases.

---

## Suites (by id prefix)

| Prefix | Suite | Est. count |
|--------|-------|----------:|
| `G-` | Unique-claim goldens (fixtures) | 40 |
| `A-` | API / contract | 12 |
| `P-` | Page critical paths | 7 |
| `R-` | RBAC / tenancy | 6 |
| `W-` | Signed webhook + idempotency | 4 |
| `C-` | Concurrency / batch independence | 3 |
| `M-` | Money-honesty + Kill A copy | 5 |
| `D-` | Dual-impl CI / parity | 3 |
| | **Total** | **≈70** |

---

## G — Unique-claim goldens (≥40)

Product tests load **every** `docs/ideas/fixtures/htsroute-*.json` and assert `routeSku` (or HTTP classify) matches `expected` / fixture route. Molecule name is never a routing input.

| ID | Fixture / case | Expect family |
|----|----------------|---------------|
| G-01 | `#1` omeprazole bulk API | `chapter_29_chemical` |
| G-02 | `#2` omeprazole enteric pellets | `heading_3003_bulk_medicament` |
| G-03 | `#3` dosage-form tablets | `heading_3004_medicament` |
| G-04 | `#4` therapeutic bulk (I89619 shape) | `chapter_29_chemical` |
| G-05 | `#5` tablet enum cheat | `reject` |
| G-06 | `#6` Note 1(a) supplement | `excluded_note_1a` |
| G-07 | `#7` GRI 3 combination | `reject` |
| G-08 | `#8` missing chemical_form | `reject` |
| G-09 | `#9` powder_bulk | `chapter_29_chemical` |
| G-10 | `#10` pellets mixture | `heading_3003_bulk_medicament` |
| G-11 | `#11` capsule measured | `heading_3004_medicament` |
| G-12 | `#12` retail packing | `heading_3004_medicament` |
| G-13 | `#13` non-therapeutic tablet | `reject` |
| G-14 | `#14` mixture + measured | `heading_3004_medicament` |
| G-15 | `#15` bulk drum not 3004 | `chapter_29_chemical` |
| G-16 | `#17` pellets + separately_defined | `reject` |
| G-17 | `#18` injectable | `heading_3004_medicament` |
| G-18 | `#19` transdermal | `heading_3004_medicament` |
| G-19 | `#20` Note 1(a) overrides tablet | `excluded_note_1a` |
| G-20 | `#21` concurrent independent SKUs (shape) | routes independent |
| G-21 | `#22` bulk relabel cheat | `chapter_29_chemical` |
| G-22 | `#23` pellets not 3004 | `heading_3003_bulk_medicament` |
| G-23 | `#24` zero facts | `reject` |
| G-24 | `#25` molecule name ignored | route from facts only |
| G-25 | `#26` pantoprazole tablets (NY N003244) | `heading_3004_medicament` |
| G-26 | `#27` pantoprazole bulk | `chapter_29_chemical` |
| G-27 | `#28` lansoprazole bulk | `chapter_29_chemical` |
| G-28 | `#29` lansoprazole capsules | `heading_3004_medicament` |
| G-29 | `#30` bulk + measured cheat | `reject` |
| G-30 | `#31` pellets + retail cheat | `reject` |
| G-31 | `#32` acetaminophen bulk (NY R04092) | `chapter_29_chemical` |
| G-32 | `#33` acetaminophen tablets | `heading_3004_medicament` |
| G-33 | `#34` ibuprofen bulk (NY I83067) | `chapter_29_chemical` |
| G-34 | `#35` ibuprofen tablets | `heading_3004_medicament` |
| G-35 | `#36` aspirin bulk (NY 890808) | `chapter_29_chemical` |
| G-36 | `#37` aspirin tablets | `heading_3004_medicament` |
| G-37 | `#38` mixture powder → 3003 | `heading_3003_bulk_medicament` |
| G-38 | `#39` mixture drum → 3003 | `heading_3003_bulk_medicament` |
| G-39 | `#40` eluxadoline bulk (NY N302614) | `chapter_29_chemical` |
| G-40 | `#41` Viberzi tablets (NY N302614) | `heading_3004_medicament` |

**Acceptance anchors (must stay green):** G-01–G-03 (29/3003/3004 chain), G-05/G-29/G-30 (cheat rejects), G-06/G-19 (Note 1(a)), G-31–G-32 (honest MFN contrast pair — not PPI Free/Free pitch), G-37–G-38 (mixture shape twins), G-39–G-40 (same-letter 6%↔Free).

**Harness note:** One parameterized `test.each(fixtures)` is fine if CI reports **≥40** distinct cases and fails per-file. Do not collapse to a single “all fixtures pass” boolean without per-id attribution.

---

## A — API / contract tests (~12)

Aligned to `htsroute-API-CONTRACT.md`. Bearer auth; routes under `/v1/orgs/:orgId/…`.

| ID | Case | Expect |
|----|------|--------|
| A-01 | `POST …/skus` valid fact card | `201` draft SKU; no `molecule_name` used for routing |
| A-02 | `POST …/skus/:id/classify` therapeutic bulk | locked `chapter_29_chemical` + `algorithm_version` + `locked_at` |
| A-03 | Re-classify same facts | `200` idempotent same body |
| A-04 | Mutate facts after lock (v0) | `409` (or force new version in sustain) |
| A-05 | `GET …/classifications?cursor&limit` | paginated; cursor stable |
| A-06 | Tablet signal, no measured/retail | classify → `reject` or `400` |
| A-07 | `gri3_combination: true` | `reject` |
| A-08 | `note_1a_food_or_supplement: true` | `excluded_note_1a` |
| A-09 | Unknown `dosage_form_signal` enum | `400` |
| A-10 | Body includes `molecule_name` label only | route unchanged vs facts-only twin |
| A-11 | `GET …/skus` filter by route / status | filtered page; limit honored |
| A-12 | Cross-org SKU id | `403` / `404` (no leak) |

---

## P — Page critical paths (~7)

One smoke per blueprint page (Playwright, or fetch+HTML assertion). Multi-page product — **not** a single calculator.

| ID | Page | Critical path |
|----|------|---------------|
| P-01 | **Catalog** | Authenticated list renders; filter by route returns matching SKU row |
| P-02 | **SKU detail** | Edit facts → Classify → locked route + cite pack visible; cheat facts show reject |
| P-03 | **Batch classify** | Upload/queue ≥2 SKUs → both complete with independent routes |
| P-04 | **Audit log** | Filter by SKU/actor; **Export CSV** contains classify event |
| P-05 | **Goldens / fixtures browser** | Read-only fixture list; live router pass/fail badge for ≥1 golden |
| P-06 | **Org settings** | Admin sees members + webhook secret field; non-admin redirected/`403` UI |
| P-07 | **Money honesty** | Static page loads; required disclaimer strings present (see §M) |

---

## R — RBAC / tenancy (~6)

Roles: `analyst`, `auditor`, `admin` (blueprint). **Not** dual-approver status gates.

| ID | Case | Expect |
|----|------|--------|
| R-01 | Missing / bad bearer | `401` |
| R-02 | Analyst `POST classify` | `200` / locked route |
| R-03 | Auditor `POST classify` | `403` |
| R-04 | Auditor `GET` classifications + audit | `200` |
| R-05 | Analyst cannot rotate webhook secret / manage members | `403` |
| R-06 | Admin org settings + member invite | `200` |

---

## W — Webhook (~4)

Inbound signed supplier catalog push and/or outbound `classification.locked` per contract.

| ID | Case | Expect |
|----|------|--------|
| W-01 | Valid HMAC-SHA256 + body | accepted; SKU upsert or event recorded |
| W-02 | Bad / missing signature | `401` / `403` |
| W-03 | Same idempotency key replay | single effect; `200` duplicate-safe |
| W-04 | `classification.locked` payload | includes `org_id`, `sku_id`, `route`, `locked_at`, `algorithm_version` |

---

## C — Concurrency (~3)

| ID | Case | Expect |
|----|------|--------|
| C-01 | Two SKUs classify in parallel (Promise.all) | each keeps own route; no swapped locks |
| C-02 | Batch job with mixed 29 + 3004 facts | results match per-SKU goldens; no shared mutable router state bleed |
| C-03 | Concurrent audit reads during classify | list remains consistent; no 5xx |

---

## M — Money-honesty + Kill A copy (~5)

Instant fail if marketing/try/FINDINGS violate `htsroute-ACCEPTANCE.md` §C–D / `htsroute-VALUE-STAKES.md`.

| ID | Assertion | Fail if |
|----|-----------|---------|
| M-01 | Money honesty page contains PPI Free/Free caveat | Claims duty savings for pantoprazole / omeprazole / Protonix showcase |
| M-02 | Acetaminophen (or ibuprofen/aspirin) pair mentions **base MFN** + preference caveat | “Guaranteed importer savings” / every-drum-pays language |
| M-03 | try.html / demo README | Missing “research demo / workflow experiment” disclaimer |
| M-04 | FINDINGS or ship digest string | Missing Kill A line: *Existing tools and brokers already do this commercially…* |
| M-05 | UI copy scan (product shell + honesty page) | “Beats brokers” / “replaces commercial HS engines” / fixture-count-as-market-proof |

Implement as static string/HTML fixtures tests (fast) plus one page fetch for P-07/M-01 overlap is OK if counted once in CI reporting — prefer **distinct** M-ids for sustain score clarity.

---

## D — Dual-impl CI (~3)

Single-impl green is **not** enough (`htsroute-ACCEPTANCE.md` §E).

| ID | Gate | Expect |
|----|------|--------|
| D-01 | Ported / invoked `check-htsroute-fixtures` | all fixture files green |
| D-02 | Ported / invoked `check-htsroute-dual` | research routers A/B agree on every fixture |
| D-03 | Product dual-impl parity endpoint or sustain hook | A vs B mismatch → test fail (non-zero exit in CI) |

Wire D-01/D-02 as required CI checks on `projects/htsroute/` PRs before merge to sustain.

---

## Phase mapping (when build is allowed)

| Product phase | Minimum green from this matrix |
|---------------|--------------------------------|
| smoke | G-01…G-38 subset (≥25) + A-01/A-02 + R-01/R-02 |
| crud | + P-01/P-02 + R-03…R-06 + A-11/A-12 |
| workflow | + P-03/P-04 + C-01 |
| integrate | + W-01…W-04 + A-05 pagination |
| scale | + C-02/C-03 |
| **sustain** | **All suites; ≥60; D-01…D-03; M-01…M-05; all 7 pages** |

---

## Explicit non-tests (do not pad the suite)

- Dual-approver / capacity-ceiling / hold-expiry as “domain”
- Full 10-digit HTS autocomplete
- Section 301 dollar claims without a named entry scenario
- Celebrating fixture pass counts as product-market proof

---

## Rollup

| Suite | Count |
|-------|------:|
| G unique-claim goldens | 40 |
| A API | 12 |
| P pages | 7 |
| R RBAC | 6 |
| W webhook | 4 |
| C concurrency | 3 |
| M money-honesty / Kill A | 5 |
| D dual-impl | 3 |
| **Estimated sustain total** | **≈70** |

**Floor:** ≥60. **Goldens floor:** ≥40. Below either → sustain fail.

---

## Related

- Blueprint: `htsroute-COMPREHENSIVE-BLUEPRINT.md`
- Acceptance: `htsroute-ACCEPTANCE.md`
- G5 cases: `htsroute-G5-cases.md`
- Algorithm: `htsroute-algorithm.md`
- API: `htsroute-API-CONTRACT.md`
- Value stakes: `htsroute-VALUE-STAKES.md`
- Fixtures: `docs/ideas/fixtures/htsroute-*.json`
