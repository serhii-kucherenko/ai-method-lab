# Phase 3 Context: Studio UI

**Mode:** Auto-generated (discuss skipped via workflow.skip_discuss)  
**Phase:** 3 — Studio UI  
**Requirements:** UI-02, UI-03

## Goal

Domain routes are real product surfaces (not stubs) with commit-native IA only — live `/commitments` `/coverage` `/gaps` `/renewals` `/imports` `/compare` `/scoreboard` with search/filters and empty/error states, plus `/scoreboard` account/gap leaderboard.

## Locked decisions

| ID | Decision | Choice | Source |
|----|----------|--------|--------|
| D-01 | Primary IA | Studio chrome primary nav lists exactly: commitments, coverage, gaps, renewals, imports, compare, scoreboard. Commercial/secondary links may include honesty/demo/home. Enforce UI-03: no isomorphic desk primary shells. | ROADMAP Phase 3 · PAGE-SPECS · UI-03 |
| D-02 | Live domain pages | Replace Phase 1 stubs with client/server pages that call Phase 2 Bearer APIs. Every domain route shows loading, empty (DESIGN copy), and error (401/422/network) states plus at least one search or filter control. | ROADMAP success #1 · DESIGN page map |
| D-03 | API client | Shared `src/lib/api.ts` (or equivalent) attaches `Authorization: Bearer` using `CCS_API_TOKEN` env when present, else the same demo token string as `DEMO_BEARER_TOKEN` in `src/lib/auth.ts`. No scoring math in React. | Phase 2 auth · ARCHITECTURE |
| D-04 | Scoreboard (UI-02) | Add `GET /api/scoreboard` rollup (account rows: provider, gap $, coverage %, unused vs spill) over gaps + latest coverage snapshots; `/scoreboard` filters by account/provider and ranks by gap $. | UI-02 · API-CONTRACT |
| D-05 | Compare surface | `/compare` lists prior compares and can POST `mode: commit_vs_ondemand` then show A vs B + `deltaUsd` with DESIGN gap-row highlight motion. Empty: need inventory + usage. | DOM-07 APIs · DESIGN motion #3 |
| D-06 | Renewals surface (Phase 3) | `/renewals` is a live renew-by queue derived from commitment `lock_end` (sort/filter by date/account) with empty copy “No renew-by dates” and CTA toward gaps/coverage. Full buy/reduce/hold RenewalCase packs = Phase 4 UI-01 — do not invent recommendation engine here. | ROADMAP Phase 3 nav · UI-01 deferred |
| D-07 | DESIGN tokens | Daylight ledger tokens from product `DESIGN.md`; tables OK on coverage/gaps; coverage bar fill motion on `/coverage`; Fraunces/Source Sans 3/IBM Plex Mono already in layout. | DESIGN.md · MKT-03 |
| D-08 | Tests | Extend `tsx --test` with `test/smoke-ui.test.ts` (route files exist, nav IA, scoreboard API shape). Keep domain-api tests green; `npm run build` passes. | Phase 1/2 test pattern |

## Discretion

- Client vs RSC data fetching (prefer client pages for filter UX if simpler).
- Exact shadcn set (Input, Table, Select, Badge) — add only what pages need.
- Whether renewals uses a thin `GET /api/renewals` read model or page-side aggregation from commitments — either OK if empty/filter behavior matches D-06.

## Deferred (not this phase)

- UI-01 RenewalCase buy/reduce/hold + export pack (Phase 4)
- Commercial `/pricing` `/onboarding` `/flows` bodies, org/members, webhooks, exports (Phase 4)
- README screenshots / try.html (Phase 5)
- Live cloud billing connectors (v2)

## Codebase notes

Phase 2 left Bearer APIs: accounts, commitments, imports, coverage, gaps, compares, goldens, features. SQLite `data/coverage.db`. Product root: `projects/commitment-coverage-studio/`. `/commitments` is still a marketing stub.

## Out of scope this phase

Pricing/demo/onboarding polish, Playwright e2e, screenshot capture, live provider SDKs, dual-scorer math changes.

---
*Generated 2026-08-07 for gsd-plan-phase / skip_discuss*
