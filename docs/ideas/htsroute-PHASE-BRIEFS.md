# htsroute — phase briefs (comprehensive ladder)

**Paper only.** Maps A03/A10 product phases to the 7-page comprehensive bar.  
Do not open `projects/htsroute/` until day-boundary ready_to_build.

Sources: `htsroute-COMPREHENSIVE-BLUEPRINT.md`, `htsroute-PAGE-SPECS.md`, `htsroute-SUSTAIN-TEST-MATRIX.md`, `docs/COMPREHENSIVE_PRODUCT.md`.

## smoke

- Aggregates: org + SKU + classification run
- Port ≥38 paper goldens into product tests
- Classify API only (no full UI yet)
- Exit: goldens green; Kill A / money-honesty in PRODUCT.md

## crud

- Pages: Catalog + SKU detail (+ Money honesty static page early)
- RBAC: analyst classify; auditor read-only
- Exit: P-catalog, P-detail, P-money critical paths; R- basics

## workflow

- Pages: Batch classify + Audit log
- Concurrent independent batch runs
- Exit: P-batch, P-audit; C- concurrency cases

## integrate

- Signed webhook + idempotency; pagination on catalog/audit
- Org settings page (tokens / webhook secret)
- Exit: W- suite; P-org; A- pagination

## scale

- Stress concurrent batch; rate limits documented
- Exit: C- stress green; no dual-impl drift

## sustain

- All **7** pages live
- Goldens browser page
- Dual-impl CI + full ~68 sustain matrix
- Offline `try.html` + StackBlitz for digest
- Exit: matrix rollup ≥60; digests include Kill A line; no PPI Free/Free duty-savings claims

## Explicit fail

Shipping smoke as “sustain” or a single calculator page fails `docs/COMPREHENSIVE_PRODUCT.md`.
