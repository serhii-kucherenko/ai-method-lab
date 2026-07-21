# htsroute — comprehensive product blueprint (pre-build)

**Status:** paper only until day-boundary ready_to_build.  
**Bar:** `docs/COMPREHENSIVE_PRODUCT.md`  
**Framing:** `htsroute-PRODUCT-FRAMING.md` (Kill A + Free/Free honesty)

## Goal

A multi-page trade-compliance **workflow experiment** that encodes the 29 / 3003 / 3004 form gate — not a one-route keyword toy.

## Aggregates (≥3)

1. **Organization** — tenants, members, roles (`analyst`, `auditor`, `admin`)
2. **SKU fact card** — form/mixing facts (no molecule-name routing input)
3. **Classification run** — locked route + algorithm version + actor + timestamp
4. **Audit event** — append-only trail of creates/classifies/overrides(rejects)
5. **Ruling cite pack** (optional v1) — linked CROSS ids for goldens (read-mostly)

## Pages (≥4)

| Page | Purpose | Role |
|------|---------|------|
| **1. Catalog** | List/filter SKUs by route, status, form signals | analyst, auditor |
| **2. SKU detail** | Edit facts, run classify, see locked route + cites | analyst |
| **3. Batch classify** | Upload/queue multiple SKUs; concurrent independent runs | analyst |
| **4. Audit log** | Filter by org/SKU/actor/route; export CSV | auditor, admin |
| **5. Goldens / fixtures browser** | Read-only view of paper goldens + pass/fail vs live router | auditor |
| **6. Org settings** | Members, tokens, webhook endpoint secret | admin |
| **7. Money honesty** | Static education: PPI Free/Free vs acetaminophen 6.5% caveat | all |

## Features (≥6 beyond CRUD)

1. Classify with consistency rejects (enum cheat, Note 1(a), GRI3)
2. Dual-impl parity check endpoint (research routers A/B) in sustain tests
3. Batch + concurrency independence
4. Audit export
5. Bearer auth + RBAC
6. Signed inbound webhook (e.g. supplier catalog push) with idempotency
7. Pagination on catalog + audit
8. Fixture browser tied to `docs/ideas/fixtures/`

## Forbidden in build

- Dual-approver status gates as “domain”
- Duty-savings claims for pantoprazole/omeprazole Free/Free
- Single-page calculator shipping as “sustain”

## Phase plan (when build starts)

| Phase | Scope |
|-------|-------|
| smoke | Org + SKU + classify + 36+ goldens ported |
| crud | Catalog + detail pages + RBAC |
| workflow | Batch + audit log |
| integrate | Webhook + pagination + rate limit |
| scale | Concurrent batch stress |
| sustain | All 7 pages + money honesty page + dual-impl CI + try.html |

## Test themes

- All paper goldens green in product test runner
- UI critical path per page (playwright or fetch+html smoke)
- Negative: molecule_name ignored; tablet cheat reject; auditor cannot classify
- Money honesty page asserts disclaimer copy present

## Explicit non-action today

Do not open `projects/htsroute/` until `htsroute-DAY-BOUNDARY.md` passes on a **new calendar day**.
