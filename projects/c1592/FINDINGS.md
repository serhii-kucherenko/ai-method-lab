# c1592 — FINDINGS

## Research hold (pre-product)

- Framing started **2026-07-22T18:55:00.000Z**; hours hold cleared → `FLIP_PATH_READY`
- **30** dual-green paper fixtures; Kill A stands (counsel / CBP)
- Fences: mitigation ≠ statutory max; PD not automatic
- Offline research demo: `demos/c1592-try/`

## Smoke

- Product opened under `projects/c1592/`
- Goldens ported (≥30); forecast returns `penalty_max` + `branch`
- Honesty page shows Kill A + PD + mitigation fences
- Forbidden claims absent from PRODUCT.md

## Crud

- Violations catalog + detail + money honesty UI critical paths
- PATCH facts; auditor mutate-forbid (403 on create/patch); auditor may forecast
- Cell `A03__P-crud-001__c1592__r1` — 34 tests green

## Workflow

- Batch independent forecasts (reject does not rewrite siblings)
- Audit JSON + CSV export; batch + audit pages
- Cell `A03__P-workflow-001__c1592__r1`

## Integrate

- HMAC webhook `/webhooks/violations` + idempotency
- Org settings RBAC (admin secret; auditor redacted); catalog pagination
- Cell `A03__P-integrate-001__c1592__r1`

## Scale

- ≥250 violation walk; limit capped at 100; concurrent batch; 429 + Retry-After
- Dual-impl A/B stable on toys
- Cell `A03__P-scale-001__c1592__r1`

## Sustain (product complete — email pending)

- **59** tests; **7** live pages (catalog, detail, batch, audit, settings, goldens, honesty)
- Offline `projects/c1592/try.html`
- Kill A in digests: statutory-max ceiling experiment — not CBP / counsel replacement
- Cell `A03__P-sustain-001__c1592__r1`
- CONTROLLER `notify.product_complete_pending: true` — findings email before next product
