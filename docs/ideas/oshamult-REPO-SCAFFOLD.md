# oshamult — day-1 repo scaffold (paper only)

**Do not create** `projects/oshamult/` until hours + `oshamult-PREFLIP-CHECKLIST.md` clear.

## Target layout

```text
projects/oshamult/
  PRODUCT.md
  HYPOTHESIS.md
  package.json
  tsconfig.json
  src/
    domain/
      penalty.ts             # serial remaining-balance (v0 order lock)
      penaltyB.ts
    api/
      server.ts
      routes/
        citations.ts
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
    citations.html
    citation-detail.html
    batch.html
    audit.html
    goldens.html
    settings.html
    money-honesty.html       # serial ≠ additive; v0 ≠ live FOM
  tests/
    fixtures/
    penalty.test.ts
    dual.test.ts
    api-smoke.test.ts
  try.html
```

## Day-1 must-touch

PRODUCT unique claim + Kill A; step-by-step remaining balances; honesty page names serial-order debt; ≥26 goldens.

## Instant fail

Additive % calculator; OIS parity claim on v0; size-on-willful; <4 pages.

## Sources

`oshamult-COMPREHENSIVE-BLUEPRINT.md`, `oshamult-SIZE-TABLE.md`, `oshamult-DAY1-NONSMOKE.md`.
