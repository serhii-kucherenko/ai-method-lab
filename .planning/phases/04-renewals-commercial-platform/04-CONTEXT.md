# Phase 4 Context: Renewals, commercial, platform

**Mode:** Auto-generated (discuss skipped via workflow.skip_discuss)  
**Phase:** 4 — Renewals, commercial, platform  
**Requirements:** UI-01, COM-01, COM-02, COM-03, COM-04, PLT-01, PLT-02, PLT-03, PLT-04, PLT-05

## Goal

FinOps leads leave with a renewal action pack; strangers can price, demo, onboard, and run ≥5 flows; platform baselines (org/members, HMAC webhooks, export, audit, rate-limit feedback) work — without isomorphic desk shells.

## Locked decisions

| ID | Decision | Choice | Source |
|----|----------|--------|--------|
| D-01 | Renewal packs (UI-01) | Upgrade `/renewals` from lock_end queue to RenewalCase packs: each case ties renew-by + linked gap $ to recommendedAction `buy` \| `reduce` \| `hold`. User can export a renewal pack. Rule: spill-dominant → buy; unused-dominant → reduce; near-zero / balanced → hold. | ROADMAP success #1 · UI-01 · ARCHITECTURE RenewalPacker |
| D-02 | Renewal APIs | Persist `renewal_cases` in SQLite. `GET/POST /api/renewals` returns/builds cases (POST packs from gaps+lock_end). `PATCH /api/renewals/:id` sets status acted/dismissed with action. Soft-sim JSON includes `softSim: true`. | ARCHITECTURE API · Phase 3 thin GET |
| D-03 | Commercial pricing (COM-01) | Real `/pricing` page: seats + connected-account tiers, honesty that there is no live card checkout. DESIGN tokens. | COM-01 · DESIGN page map |
| D-04 | Guided demo (COM-02) | Replace demo stub with guided Import → Match → Gap → Renew including A vs B compare step. Links into live domain routes. | COM-02 · FEATURES F1/F3/F4 |
| D-05 | Onboarding (COM-03) | `/onboarding` first-run checklist with visible progress (local or API-backed soft-sim). | COM-03 |
| D-06 | Flows index (COM-04) | `/flows` lists ≥5 named journeys with CTAs matching FEATURES F1–F5 (Import & match, Multi-cloud rollup, Renewal pack, Dual compare, Export & review). Not footer-only. | COM-04 · FEATURES flows table |
| D-07 | Org / members / bearer (PLT-01) | `/settings` for org settings + members CRUD via `GET/PATCH /api/org` and `GET/POST /api/members`. Existing Bearer demo token remains; settings mutations require Bearer. | PLT-01 · ARCHITECTURE |
| D-08 | Webhook HMAC (PLT-02) | `POST /api/webhooks/test` verifies HMAC-SHA256 of raw body (header `X-CCS-Signature`) using org webhook secret (or `CCS_WEBHOOK_SECRET`). Honor `Idempotency-Key` → 409 on replay. Soft-sim events only. | PLT-02 · PRODUCT_STACK |
| D-09 | Export (PLT-03) | `GET /api/export?kind=gaps\|renewals\|compares&format=json\|csv` Bearer-protected. Renewals UI export uses this. | PLT-03 · ROADMAP |
| D-10 | Audit trail (PLT-04) | Persist audit entries (who/what/when) for renewals act/dismiss, org/member changes, exports, webhook accepts. Surface under `/settings` (or settings audit panel) — not a primary StudioShell nav item and not a desk home. | PLT-04 · FEATURES #17 |
| D-11 | Rate-limit feedback (PLT-05) | In-memory rate limit on mutating `/api/*` (and abusive GETs as needed): 429 + `Retry-After` + `X-RateLimit-*` headers; client/UI surfaces rate-limit feedback when present. | PLT-05 |
| D-12 | Anti-desk IA | Commercial + settings routes must not introduce primary shells for jobs/lifecycle/scenario/batch. Domain primary nav stays the seven commit-native routes from Phase 3. | UI-03 · lab ban |
| D-13 | Stack / deps | No new npm packages for HMAC/rate-limit — use `node:crypto` and in-memory Map. Extend existing better-sqlite3 schema via `migrate`. | Phase 2/3 patterns |
| D-14 | Tests | Extend `tsx --test`: domain-api for renewals/export/webhooks/org/rate-limit; smoke-ui/smoke-mkt for commercial routes + anti-desk. `npm test` + `npm run build` green. | Phase 1–3 pattern |

## Discretion

- Exact seat/account tier copy and price numbers (honest soft-sim packaging).
- Whether onboarding progress is localStorage vs SQLite checklist rows.
- Exact rate-limit window (e.g. 60 req/min per token) as long as 429 + headers work.
- Audit panel layout inside `/settings` vs nested `/settings/audit` path.

## Deferred (not this phase)

- README screenshots / try.html / ≥25 feature sustain count polish (Phase 5)
- Live cloud billing connectors / auto-purchase (v2)
- Real card checkout
- Playwright e2e suite (optional later)

## Codebase notes

Product root: `projects/commitment-coverage-studio/`. Phase 3 left live seven domain routes + thin `GET /api/renewals` lock_end queue + demo CTA stub. Bearer `ccs-demo-token` / `CCS_API_TOKEN`. SQLite `data/coverage.db`. Features API still lists early capabilities only.

## Out of scope this phase

Sustain screenshot capture, live provider SDKs, dual-scorer math changes, isomorphic desk clones.

---
*Generated 2026-08-07 for gsd-plan-phase / skip_discuss*
