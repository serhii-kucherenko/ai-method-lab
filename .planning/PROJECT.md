# Commitment Coverage Studio

## What This Is

A FinOps soft-sim studio that imports cloud commitment inventory and usage, computes under-coverage and unused-commit gaps in dollars, and compares a commit-matched path against an on-demand-blind baseline so platform leads walk into renewals with a dollar gap, not a chart museum.

Built inside AI Method Lab at `projects/commitment-coverage-studio/` (Next.js + Tailwind + shadcn; Python sidecar only if the claim needs it).

## Core Value

Show where commitments are under-covered or wasted, in dollars, before renewal.

## Business Context

- **Customer**: Cloud FinOps / platform leads (AWS, GCP, Azure mid-market+)
- **Revenue model**: Seats + connected-account usage tiers (see `/pricing`)
- **Success metric**: Dual-impl ≥30 goldens; live app smoke; buyer can open a renewal pack with gap $
- **Strategy notes**: Tier B 76 under `biz-rubric-v2`; depth pack in `docs/ideas/commitment-coverage-studio-*`; PM GO already issued

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Commitment inventory + usage import with multi-cloud tags
- [ ] Coverage and gap dollars by account / lock window
- [ ] Dual scorers: commit-matched (A) vs on-demand-blind (B); ≥30 goldens
- [ ] Renewal cases + recommended actions pack
- [ ] Domain IA: `/commitments` `/coverage` `/gaps` `/renewals` `/imports` `/compare` `/scoreboard`
- [ ] Commercial surfaces: `/` `/pricing` `/demo` `/onboarding` `/flows` `/honesty` + platform must-haves
- [ ] ≥25 real features, ≥11 pages, ≥5 user flows
- [ ] Live `next build` + app-up smoke + README live screenshots before finish

### Out of Scope

- Single-cloud Cost Explorer noun-swap — fence is multi-cloud + renewal workflow
- Idle Seat (SaaS seat waste) / True Up (vendor license meters) clones
- Isomorphic desk shells (`/jobs` `/lifecycle` `/scenario` `/batch` `/audit` `/goldens` as primary IA)
- Devices, clinical carepaths, wet-lab biologics, retail novelty soft-sims

## Context

- Lab controller `current_idea`: `commitment-coverage-studio`; depth pack complete (VISION, ROADMAP, PRD, ERD, blueprint, DESIGN, PM-GO, ARS brief)
- Prior finished products (e.g. Spend Cap) are sibling studios under `projects/` — do not noun-swap their shells
- Stack protocol: `docs/PRODUCT_STACK.md`; design protocol: `protocols/DESIGN.md` + idea DESIGN note
- GSD owns phase loop for this product; Linear remains lab tracker elsewhere

## Constraints

- **Tech stack**: Next.js App Router + Tailwind + shadcn; SQLite persistence default; bearer auth; provider-agnostic payment webhook HMAC
- **Comprehensive bar**: `docs/COMPREHENSIVE_PRODUCT.md` — one sophisticated product, not a template desk
- **Naming**: Mature display name; slug `commitment-coverage-studio`
- **Git**: Always commit and push planning + product work; finish email only on product_complete when notify enabled

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Soft-sim studio, not live billing console | Software-solvable FinOps decision aid; refuse device/clinical/wet-lab | — Pending build |
| Dual A/B coverage claim | Differentiates from Cost Explorer skins and seat/license tools | — Pending |
| GSD phase loop for delivery | User-directed redo with discuss→plan→execute→verify→ship | ✓ Good |
| Standard granularity, YOLO auto | Hands-free 15m loop; balanced phase count for comprehensive bar | ✓ Good |

---
*Last updated: 2026-08-07 after gsd-new-project --auto*
