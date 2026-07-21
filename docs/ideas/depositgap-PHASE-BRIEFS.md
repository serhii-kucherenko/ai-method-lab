# depositgap — phase briefs (comprehensive ladder)

**Paper only / seed.** Maps A03/A10 product phases to the 8-page comprehensive bar.  
Do **not** open `projects/depositgap/` while `htsroute` holds the slot.

Sources: `depositgap-COMPREHENSIVE-BLUEPRINT.md`, `depositgap-PAGE-SPECS.md`, `depositgap-SUSTAIN-TEST-MATRIX.md`, `depositgap-G6-summary.md`, `docs/COMPREHENSIVE_PRODUCT.md`.

## smoke

- Aggregates: org + entry + forecast run
- Port ≥23 paper goldens (+ X/Y product notes as RBAC/concurrency tests)
- Forecast API only (no full UI yet)
- Exit: goldens green; Kill A honesty in PRODUCT.md (forecast ≠ ACE liquidation)

## crud

- Pages: Catalog + Entry detail (+ Money honesty static early)
- RBAC: analyst mutates + forecasts; auditor read-only
- Exit: P-catalog, P-detail, P-honesty critical paths; R- basics

## workflow

- Pages: Batch forecast + Cash impact rollup + Audit log
- Concurrent independent entry runs (note Y)
- Exit: P-batch, P-cash, P-audit; C- concurrency

## integrate

- Signed webhook + idempotency; pagination on catalog/cash/audit
- Org settings (tokens / webhook secret)
- Exit: W- suite; P-org; A- pagination

## scale

- Stress concurrent batch; rate limits documented
- Exit: C- stress green; no dual-impl drift

## sustain

- All **8** pages live
- Goldens browser page
- Dual-impl CI + full sustain matrix (~60+)
- Offline `try.html` for digest
- Exit: matrix rollup floor; digests include Kill A line; never claim broker/CBP replacement

## Explicit fail

Shipping smoke as “sustain” or a single true-up calculator page fails `docs/COMPREHENSIVE_PRODUCT.md`.
