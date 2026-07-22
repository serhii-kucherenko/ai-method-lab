# oshamult findings

## Smoke (scored)

- Flipped after hours clear + dual **26/26** paper goldens
- Domain: `penalty.ts` + `penaltyB.ts` serial remaining-balance with `steps[]`
- Forecast API: bearer auth → org → citation → `/forecast` returns penalty + four serial steps; additive cheat → 422
- UI: money-honesty (Kill A + serial≠additive + v0 order debt), citations catalog, citation detail, goldens (≥4 pages)
- Tests: **29** green (fixtures + smoke + ui-critical)
- Digests: serial-penalty **workflow / method experiment**; no OIS parity claims

## Next

CRUD phase: catalog filters + citation PATCH + auditor RBAC.
