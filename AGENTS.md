# AGENTS.md

This repo is the **AI Method Lab** control plane: experiment by building **few, comprehensive products** under `projects/`.

## Default: paused until depth

If `matrix/CONTROLLER.json` says `paused` / `hard_stop`, **do not** pick papers or open product folders. Wait for human steer or an explicit unpause with a real product pack.

When **not** paused:

- Read `protocols/AUTONOMOUS_CONTROLLER.md`, `docs/PAPERS_INTAKE.md`, `docs/COMPREHENSIVE_PRODUCT.md`, `docs/DEPTH_RESTART.md`, `docs/BUSINESS_RUBRIC.md` first
- **Business ideas first:** only problems **software engineering can fix** (SaaS / tooling / benches / ops). Ban devices, healthcare carepaths, wet-lab biologics, and retail/consumer novelty soft-sims (`biz-rubric-v2`)
- Papers are **optional research input** — never same-tick pick→smoke→sustain; never climb a paper that fails the software-solvable gate
- **Paper deepening:** Researcher uses Cursor skill `ars-lab-paper-research` + `protocols/ARS_PAPER_RESEARCH.md` (OpenAlex/arXiv; **no Anthropic key**) before PM go when a paper backs the idea
- Roles: researcher → product manager → senior architect → **product designer** → product delivery → best-practices tutor
- Require **PM go + Vision/Roadmap/PRD/ERD/blueprint + DESIGN** before `projects/<slug>/`
- Stack: **Next.js + Tailwind + shadcn** (`docs/PRODUCT_STACK.md`); Python sidecar when the claim needs it
- Marketing landing at `/` must sell a **specific buyer outcome** — not a generic lab desk
- **Ban isomorphic desk clones** (noun-swap of jobs/lifecycle/scenario/goldens shells)
- One product at a time; ≥25 real features / ≥11 pages including `/pricing`, `/demo`, `/onboarding`, and ≥5 sophisticated user flows plus category platform must-haves; live `next build` + app-up smoke before finish email
- Every product README must embed live platform screenshots under `projects/<slug>/screenshots/` (landing, primary workspace, pricing, demo, onboarding/flows) - capture with `scripts/capture-product-screenshots.mjs` before sustain
- Always commit, always push to origin/main, always merge own PRs when CI green
- Never rewrite `package.json` with a UTF-8 BOM; use Node writes or `node scripts/strip-json-bom.mjs --check`
- If notify.enabled: email **only on finish** (`product_complete`) and hard_stop — **no start emails**. Finish mail opens with business TLDR (idea / potential / PMF / model / score tier); then story; Sources footer; full GitHub https URLs (`protocols/NOTIFY.md`)
- **Garbage collector:** score every finished product; prefer A/B picks only; keep improving `docs/BUSINESS_RUBRIC.md` (`protocols/GARBAGE_COLLECTOR.md`, `matrix/BUSINESS_SCORECARD.md`)

Wake prompt (also in `docs/AUTOMATION.md`):

```text
You are the AI Method Lab controller.
Read CONTROLLER.json first. If paused, stop.
If running: one comprehensive product only — software-solvable business idea, buyer story, selling points, designer pack, then build.
Never devices / clinical carepaths / wet-lab / retail novelty. Never isomorphic desk clones. Never pick→smoke same tick.
Mature names. ≥25 real features. `/pricing` + `/demo` + `/onboarding` + ≥5 user flows + platform must-haves. Live app smoke + README screenshots before finish email.
Commit push merge. Notify only if enabled.
```

## What to optimize for

Evidence that the workflow can produce **one sophisticated software product a stranger would pay for** — not a high count of paper soft-sims or template desks.

## Hard constraints

1. Research ≠ experiment ≠ promote
2. One product phase in flight at a time
3. Oracles and harness are not writable by the agent under test during a run
4. Midterm method changes must version, redo, and triple-test
5. No confirmation gates between phases when autonomous — **but** `paused` always wins over autonomy
6. No isomorphic dual-gate / desk-template clones

## Pointers

- `project_tracker: linear` — [ai-method-lab](https://linear.app/serhii-kucherenko/project/ai-method-lab-27d1b78be235)
- Portfolio: `projects/PORTFOLIO.md`
- Agent roles: `protocols/AGENT_ROLES.md`
- Product runbook: `protocols/PRODUCT_RUNBOOK.md`
- Paper research (ARS / Cursor): `protocols/ARS_PAPER_RESEARCH.md` · `docs/ARS_CURSOR.md`
- Workflow: `docs/DEVELOPMENT_WORKFLOW.md`
- Controller: `protocols/AUTONOMOUS_CONTROLLER.md` + `matrix/CONTROLLER.json`
- Email: `protocols/NOTIFY.md`
- Scoring: `docs/RUBRIC.md` (cells) · `docs/BUSINESS_RUBRIC.md` + `matrix/BUSINESS_SCORECARD.md` (ideas)
- Backlog: `docs/BACKLOG.md`
- Comprehensive bar: `docs/COMPREHENSIVE_PRODUCT.md`
- Garbage collector: `protocols/GARBAGE_COLLECTOR.md`

## Cursor Cloud specific instructions

This repo is a **docs/protocol control-plane** plus **product trees under `projects/`**.

- Validate cell-score JSONs against `harness/cell.schema.json` when scoring.
- Product apps under `projects/<id>/` set up their own deps (Node+TS per CONTROLLER defaults).
- Never edit `oracles/` or `harness/` to make a run pass.
- Prefer committing product source in `projects/` (durable). `sandboxes/` remains gitignored for optional A/B cells.
