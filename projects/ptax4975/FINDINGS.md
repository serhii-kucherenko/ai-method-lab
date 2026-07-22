# ptax4975 findings

## Research hold (pre-product)

- Framing started **2026-07-22T12:25:00.000Z**; hours hold + tick floor cleared → flip
- **35** dual-green paper fixtures; Kill A stands (counsel / Form 5330)
- Three honesty fences: FMV, taxable-period end dates, excess-compensation

## Smoke — GREEN (`A03__P-smoke-001__ptax4975__r1`)

- Product opened under `projects/ptax4975/`
- 35 dual goldens ported; forecast returns `initial_tax`, `additional_tax`, `total`
- Honesty page: Kill A + three fences; catalog + detail + goldens pages
- **37** tests pass; lint clean

## Crud — GREEN (`A03__P-crud-001__ptax4975__r1`)

- PATCH transaction; members route; auditor list/get/forecast OK, create/patch **403**
- Catalog + detail + honesty still live; **38** tests

## Workflow — GREEN (`A03__P-workflow-001__ptax4975__r1`)

- Batch independence (ok + flat-cheat reject); audit JSON + CSV; auditor **403** on batch
- batch.html + audit.html; **39** tests
- Next: integrate (webhook + pagination + settings)

## Digests

Use `docs/ideas/ptax4975-DIGEST-HOLD.md` language — counsel still wins; toys not filed returns.
