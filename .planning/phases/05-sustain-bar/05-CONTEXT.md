# Phase 5 Context: Sustain bar

**Mode:** Auto-generated (discuss skipped via workflow.skip_discuss)  
**Phase:** 5 — Sustain bar  
**Requirements:** SUS-01, SUS-02, SUS-03, SUS-04

## Goal

The running product meets the lab comprehensive finish gate: ≥25 features, ≥11 pages, live build + app-up smoke, README with live screenshots, offline try.html dual-claim digest.

## Locked decisions

| ID | Decision | Choice | Source |
|----|----------|--------|--------|
| D-01 | Feature bar (SUS-01) | Expand `GET /api/features` to ≥25 real capability IDs that map to shipped surfaces (domain IA, commercial, platform). Smoke asserts count ≥25 and ≥11 page routes including `/`, `/pricing`, `/demo`, `/onboarding`, `/flows`, `/honesty`, plus domain routes. | SUS-01 · COMPREHENSIVE_PRODUCT |
| D-02 | Live smoke (SUS-02) | `npm run build` green; app-up smoke hits live `GET /` (start next, fetch, assert display name) — extend existing smoke or add `test/app-up.test.ts` / script. | SUS-02 · ROADMAP |
| D-03 | Screenshots (SUS-03) | Capture with `node scripts/capture-product-screenshots.mjs projects/commitment-coverage-studio --start` (or `--base` if already up). Store under `projects/commitment-coverage-studio/screenshots/`. Embed in product README Screenshots section near top after one-line pitch. Min: landing, primary workspace (`/commitments`), pricing, demo, onboarding or flows. Live UI only — no AI placeholders. | SUS-03 · product-readme-screenshots rule |
| D-04 | try.html (SUS-04) | Root `projects/commitment-coverage-studio/try.html` offline dual-claim digest (A commit-matched vs B on-demand-blind) with link from in-app (honesty or demo/guide). No live billing claims. | SUS-04 |
| D-05 | README rewrite | Replace create-next-app boilerplate with plain-human product README: pitch, screenshots, run commands, honesty soft-sim fence. No AI/LLM tool mentions. | plain-human-deliverables |
| D-06 | Anti-desk | Sustain work must not add jobs/lifecycle/scenario/batch primary shells. | UI-03 |

## Discretion

- Exact feature ID names as long as count ≥25 and honest.
- Whether app-up smoke is node:test or a small script in package.json.
- try.html styling — keep lightweight offline HTML/CSS, DESIGN token colors inline OK.

## Deferred

- Live cloud connectors / auto-purchase (v2)
- Real card checkout
- New domain features beyond sustain gate

## Codebase notes

Phases 1–4 complete. Product at `projects/commitment-coverage-studio/`. Features API currently ~20 IDs. README still create-next-app stub. Capture script at repo `scripts/capture-product-screenshots.mjs`.

## Out of scope

New commercial pages beyond polish; dual-scorer math changes.
