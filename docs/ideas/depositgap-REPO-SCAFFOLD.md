# depositgap — day-1 repo scaffold (paper only)

**Do not create** `projects/depositgap/` until htsroute clears and `depositgap-POST-HTSROUTE-RUN.md` passes.  
Prevents day-1 “discovery” of a one-field rate widget.

## Target layout

```text
projects/depositgap/
  PRODUCT.md                 # framing + unique claim + Kill A forecast-only
  HYPOTHESIS.md              # from depositgap-HYPOTHESIS-DRAFT.md
  package.json
  tsconfig.json
  src/
    domain/
      forecast.ts            # deposit→assessed→interest
      forecastB.ts           # dual-impl twin
    api/
      server.ts
      routes/
        entries.ts
        forecast.ts
        batch.ts
        cash-impact.ts
        audit.ts
        goldens.ts
        settings.ts
        webhooks.ts
    auth/
      bearer.ts
      rbac.ts
    db/
      schema.sql
      migrate.ts
  public/ or views/
    entries.html             # page 1 catalog
    entry-detail.html        # page 2
    batch.html               # page 3
    cash-impact.html         # page 4
    audit.html               # page 5
    goldens.html             # page 6
    settings.html            # page 7
    money-honesty.html       # page 8 — deposit ≠ final; delinquency ≠ gap
  tests/
    fixtures/                # port docs/ideas/fixtures/depositgap-*
    forecast.test.ts
    dual.test.ts
    api-smoke.test.ts
  try.html
```

## Day-1 must-touch (from `depositgap-DAY1-NONSMOKE.md`)

| Artifact | Required content |
|----------|------------------|
| PRODUCT.md | Deposit vs assessed + § 1677g + Kill A; no ACE replacement |
| forecast.ts | duty_delta + interest + true_up — not status rename |
| money-honesty page | Day-count fence + note Z (no delinquency conflation) |
| tests | ≥23 goldens ported or linked |

## Instant fail shapes

- Single rate form + dual approve  
- Day-count accrual without deposit vs assessed  
- Digests claiming CBP bill printout

## Sources

`depositgap-COMPREHENSIVE-BLUEPRINT.md`, `depositgap-PAGE-SPECS.md`, `depositgap-API-CONTRACT.md`, `depositgap-DAY1-NONSMOKE.md`, `QUEUE-ISO-AUDIT.md`.
