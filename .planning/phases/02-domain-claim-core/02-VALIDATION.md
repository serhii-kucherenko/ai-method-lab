# Phase 2 Validation Strategy

**Phase:** 02-domain-claim-core  
**Nyquist:** sampling via goldens + domain-api tests before phase close

## Validation Architecture

| Requirement | Automated check | Command | Sampling |
|-------------|-----------------|---------|----------|
| DOM-05 Scorer A | goldens.test asserts scoreCommitMatched outputs on fixtures | `npx tsx --test test/goldens.test.ts` | Plan 01 |
| DOM-06 Scorer B | goldens.test asserts scoreOnDemandBlind diverges from A | same | Plan 01 |
| DOM-08 ≥30 goldens + APIs | GOLDENS length ≥30; sample/features route refs | same + route module asserts | Plan 01 |
| DOM-01 Inventory CRUD | domain-api: create/search/archive commitments + multi-cloud accounts | `npx tsx --test test/domain-api.test.ts` | Plan 02 |
| DOM-02 Imports | domain-api: batch accept/fail status + UsageSlice rows | same | Plan 02 |
| DOM-03 Coverage | domain-api: POST coverage → snapshot %/$ ; missing usage → 422 | same | Plan 03 |
| DOM-04 Gaps | domain-api: unused_commit and ondemand_spill findings in $ | same | Plan 03 |
| DOM-07 Compare | domain-api: A vs B material deltaUsd on commit_vs_ondemand | same | Plan 03 |
| Regression | Full suite | `npm test` (smoke-mkt + goldens + domain-api) | End of Plan 03 |
| Build health | `next build` | `npm run build` | End of each plan (optional if slow; required before Phase 3) |

## Wave 0

- Plan 02-01 Task 1 creates `test/goldens.test.ts` (RED→GREEN tracer) before expanding to ≥30 fixtures.
- Plan 02-02 Task 1 creates `test/domain-api.test.ts` before import/CRUD expansion.

## Manual backstop

None blocking (YOLO / autonomous). Optional: curl Bearer POST coverage after execute. Domain page chrome is Phase 3 (D-11).
