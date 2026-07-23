# Product experiment runbook

How to run one **product phase** (not a throwaway sandbox cell).

**Role:** Product delivery (`protocols/AGENT_ROLES.md`). Researcher, **product manager** (roadmap + go), senior architect, and **product designer** (`protocols/DESIGN.md`) must have finished their packs first (paper pick→build: design note before multi-page UI).

**Stack:** Next.js App Router + TypeScript + Tailwind CSS + shadcn/ui — `docs/PRODUCT_STACK.md` + CONTROLLER `product_defaults`. **Python** under `python/` when the paper claim needs it; README must show how to run Next + sidecar together.

## 0. Comprehensive bar (mandatory)

Before opening `projects/<id>/`, confirm `docs/COMPREHENSIVE_PRODUCT.md` + architect pack:

- Idea cleared `protocols/IDEA_DEPTH.md` → `ready_to_build`
- Product manager roadmap + `docs/ideas/<id>-PM-GO.md` with `decision: go`
- Vision / roadmap / PRD / ERD on file: `docs/ideas/<id>-{VISION,ROADMAP,PRD,ERD}.md`
- Blueprint on file: `docs/ideas/<id>-COMPREHENSIVE-BLUEPRINT.md` (≥4 pages, ≥3 aggregates, ≥6 features beyond CRUD)
- Not an isomorphic dual-gate / capacity clone

Shallow single-page smokes fail the lab goal even if tests are green.

## 1. Pick work

From `projects/PORTFOLIO.md` + `docs/BACKLOG.md`. One phase in flight. Mark portfolio + backlog **in progress**.

## 2. Freeze inputs

Pin:

- Product dir: `projects/<id>/`
- Hypothesis: `projects/<id>/HYPOTHESIS.md`
- Workflow: `docs/DEVELOPMENT_WORKFLOW.md` + approach cards (default A03; A10 when PRODUCT says so)
- Phase brief: `projects/briefs/P-<phase>-001.md` (or PRODUCT sustain section)
- Oracle: `oracles/P-<phase>-001.md` (sustain: PRODUCT checklist)

Do not edit oracles mid-run. Midterm method change → `MIDTERM_CHANGE.md` + `TRIPLE_TEST.md`.

## 3. Work in the product folder

```text
projects/<id>/
```

This is the durable product. Prefer evolving this tree over creating `sandboxes/` copies.
Record path in cell JSON as `sandbox_path` **or** `product_path` (prefer `product_path` for portfolio work).

Scaffold (if still a thin smoke): `create-next-app` + `shadcn init -d --base radix` per `docs/PRODUCT_STACK.md`. Implement pages against `docs/ideas/<id>-DESIGN.md`.

Optional: use `sandboxes/` only for short A/B method comparisons that should not pollute the product.

## 4. Execute

Follow DEVELOPMENT_WORKFLOW stages for the phase slice. RED → GREEN. Log interventions.

### UI never broken (phase exit)

Do not score the phase complete until:

1. Failing tests for the slice were committed first (RED), then made green (no weaken-to-pass)
2. Each blueprint page unlocked this phase has an automated **UI critical path** (browser E2E or HTML+interaction smoke) — API ladder alone is insufficient
3. Sustain additionally requires ≥4 distinct views live; one `public/index.html` calculator fails

## 5. Score

Fill `matrix/cells/<approach>__P-<phase>-001__<product>__rN.json` (or existing id scheme).
Append `projects/<id>/FINDINGS.md` and `matrix/FINDINGS.md`.
Update leaderboard / PORTFOLIO status.

## 6. Notify

If `notify.enabled`, email per `protocols/NOTIFY.md` — story first (idea, project, what we built, then proof), plain language, no acronyms. Do not substitute a list of static docs for the summary.

On **product finished**: commit `projects/<id>/try.html` (standalone offline demo), attach it to the Resend email as `try-<id>.html`, and include one StackBlitz try link. See `protocols/NOTIFY.md` → Try artifacts.

## 7. Close + continue

Commit + push + merge. Advance to next phase on the **same** product until sustain (or abandon). On sustain: product-manager findings email first (`protocols/NOTIFY.md`); only then clear the product slot and resume research / next idea.

**Do not ask for confirmation.**
