# htsroute — day-1 repo scaffold (paper only)

**Do not create** `projects/htsroute/` until preflip clears and `htsroute-TOMORROW-RUN.md` passes.  
This is the intended first-commit tree so day-1 cannot “discover” a one-file calculator.

## Target layout

```text
projects/htsroute/
  PRODUCT.md                 # paste framing + unique claim + Kill A
  HYPOTHESIS.md              # from htsroute-HYPOTHESIS-DRAFT.md
  package.json
  tsconfig.json
  src/
    domain/
      classify.ts            # unique claim engine (29/3003/3004)
      classifyB.ts           # dual-impl twin (or test-only twin)
    api/
      server.ts
      routes/
        skus.ts
        classify.ts
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
    catalog.html             # page 1
    sku-detail.html          # page 2
    batch.html               # page 3
    audit.html               # page 4
    goldens.html             # page 5
    settings.html            # page 6
    money-honesty.html       # page 7 — Challenge D visible day-1
  tests/
    fixtures/                # port of docs/ideas/fixtures/htsroute-*
    classify.test.ts
    dual.test.ts
    api-smoke.test.ts
  try.html                   # offline claim demo (after smoke+; not day-0 substitute)
```

## Day-1 must-touch (from `htsroute-DAY1-NONSMOKE.md`)

| Artifact | Required content |
|----------|------------------|
| PRODUCT.md | Unique claim + Kill A + **no** PPI Free/Free savings |
| classify.ts | Form/mixing gate — not status rename |
| money-honesty page | Challenge D / VALUE-STAKES visible |
| tests | ≥42 goldens ported or linked |

## Instant fail shapes

- Only `src/index.ts` + dual-approve middleware  
- Pages folder with a single form  
- Fixtures that are pass-count theater without form facts

## Sources

`htsroute-COMPREHENSIVE-BLUEPRINT.md`, `htsroute-PAGE-SPECS.md`, `htsroute-API-CONTRACT.md`, `htsroute-DAY1-NONSMOKE.md`.
