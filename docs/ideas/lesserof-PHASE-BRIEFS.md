# lesserof — phase briefs (comprehensive ladder)

**Paper only / seed.** Do not open `projects/lesserof/` until activation queue reaches it (after htsroute + prefer depositgap first).

Sources: `lesserof-COMPREHENSIVE-BLUEPRINT.md`, `lesserof-ACCEPTANCE.md`, `lesserof-G6-summary.md`, `docs/COMPREHENSIVE_PRODUCT.md`.

## smoke

- Aggregates: org + claim line + refund run
- Port ≥23 paper goldens
- Calc API only
- Exit: goldens green; Kill A honesty in PRODUCT.md

## crud

- Pages: Catalog + claim detail (+ money honesty static)
- RBAC: analyst mutates; auditor read-only
- Exit: critical paths; R- basics

## workflow

- Batch multi-line + audit log
- Independent line caps; one reject fails batch
- Exit: P-batch, P-audit; C- concurrency

## integrate

- Webhook + pagination; org settings
- Exit: W- / P-org / A- pagination

## scale

- Concurrent batch stress; no dual-impl drift

## sustain

- All blueprint pages; goldens browser; dual-impl CI; try.html
- Digests: stacked-cap experiment; specialists still file

## Explicit fail

Smoke-as-sustain or “99% of paid always” product.
