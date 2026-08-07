# Phase 1 Validation Strategy

**Phase:** 01-smoke-trust  
**Nyquist:** sampling via automated smoke before phase close

## Validation Architecture

| Requirement | Automated check | Command | Sampling |
|-------------|-----------------|---------|----------|
| MKT-01 brand landing | smoke-mkt asserts display name + headline + CTAs | `npx tsx --test test/smoke-mkt.test.ts` | Every plan |
| MKT-02 honesty fence | smoke-mkt asserts soft-sim + Idle Seat/True Up + Sources | same | Plan 02 |
| MKT-03 DESIGN tokens | smoke-mkt asserts CSS tokens + Fraunces/Source Sans 3/IBM Plex Mono | same | Plan 01 |
| Build health | `next build` | `npm run build` | End of each plan |
| Anti-desk IA | smoke-mkt negative check on desk route links | same | Plan 02 |

## Wave 0

`test/smoke-mkt.test.ts` is created in plan 01-01 Task 1 (tracer) before expansion work.

## Manual backstop

Optional visual pass of `/` and `/honesty` in `next dev` after execute — not a blocking checkpoint (YOLO / autonomous phase).
