# lesserof — day-1 repo scaffold (paper only)

**Do not create** `projects/lesserof/` until depositgap clears and `lesserof-POST-DEPOSITGAP-RUN.md` passes.

## Target layout

```text
projects/lesserof/
  PRODUCT.md
  HYPOTHESIS.md
  package.json
  tsconfig.json
  src/
    domain/
      recover.ts             # stacked TFTEA + USMCA + basket + direct-ID
      recoverB.ts
    api/
      server.ts
      routes/
        claims.ts
        recover.ts
        batch.ts
        lane-compare.ts
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
    claims.html
    claim-detail.html
    batch.html
    lane-compare.html        # naive 99%-of-paid vs stacked caps
    audit.html
    goldens.html
    settings.html
    money-honesty.html
  tests/
    fixtures/
    recover.test.ts
    dual.test.ts
    api-smoke.test.ts
  try.html
```

## Day-1 must-touch

| Artifact | Required content |
|----------|------------------|
| PRODUCT.md | Stacked refund caps + Kill A; not “×0.99” |
| recover.ts | Unique claim engine — not dual-gate status |
| lane-compare / honesty | Naive 99%-of-paid shown wrong |
| tests | ≥23 goldens ported |

## Instant fail

Single paid×0.99 form; dual-approver status as domain; <4 pages.

## Sources

`lesserof-COMPREHENSIVE-BLUEPRINT.md`, `lesserof-DAY1-NONSMOKE.md`, `QUEUE-ISO-AUDIT.md`.
