# c1592 — day-1 repo scaffold (paper only)

**Do not create** `projects/c1592/` until `check-c1592-hour-status.mjs` → `FLIP_PATH_READY`.

## Target layout

```text
projects/c1592/
  PRODUCT.md
  HYPOTHESIS.md
  FINDINGS.md
  package.json
  tsconfig.json
  src/
    domain/
      penaltyMax.ts          # § 1592(c) statutory max
      penaltyMaxB.ts         # dual-impl twin
    api/
      server.ts
      routes/
        violations.ts
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
      schema.ts
      client.ts
  public/
    honesty.html
    try.html
  test/
    fixtures/
    dual.test.ts
    smoke.test.ts
```

## Day-1 must port

- ≥26 goldens from `docs/ideas/fixtures/c1592-*.json`
- Oracle twins matching `c1592-oracle.mjs` A/B
- Forecast returns `penalty_max` + `branch`
- Honesty: Kill A + PD + mitigation fences

## Instant abort

Flat-2×-only widget; CBP/counsel replacement copy; silent mitigation/PD “fix”.
