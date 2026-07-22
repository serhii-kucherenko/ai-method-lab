# ptax4975 — day-1 repo scaffold (paper only)

**Do not create** `projects/ptax4975/` until `check-ptax4975-hour-status.mjs` → `FLIP_PATH_READY`.

## Target layout

```text
projects/ptax4975/
  PRODUCT.md
  HYPOTHESIS.md
  package.json
  tsconfig.json
  src/
    domain/
      excise.ts              # 15% × year-parts + 100% if uncorrected + greater-of FMV
      exciseB.ts
    api/
      server.ts
      routes/
        transactions.ts
        forecast.ts
        batch.ts
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
    transactions.html
    transaction-detail.html
    batch.html
    audit.html
    goldens.html
    money-honesty.html       # not Form 5330; FMV fence
    settings.html
  tests/
    fixtures/
    excise.test.ts
    dual.test.ts
    api-smoke.test.ts
  try.html
```

## Day-1 must-touch

PRODUCT unique claim + Kill A; tier breakdown API; honesty + FMV + taxable-period + excess-comp fences; ≥35 goldens.

## Instant fail

Flat once-excise widget; Form 5330 replacement claim; silent highest-during-period FMV “fix”; silent excess-compensation “fix”; <4 pages.

## Sources

`ptax4975-COMPREHENSIVE-BLUEPRINT.md`, `ptax4975-FMV-FENCE.md`, `ptax4975-TAXABLE-PERIOD-FENCE.md`, `ptax4975-EXCESS-COMP-FENCE.md`, `ptax4975-DAY1-NONSMOKE.md`.
