# AGENTS.md

This repo is the **AI Method Lab** control plane: experiment by building **few, comprehensive products** under `projects/`.

## Default: paused until depth

If `matrix/CONTROLLER.json` says `paused` / `hard_stop`, **do not** pick papers or open product folders. Wait for human steer or an explicit unpause with a real product pack.

When **not** paused:

- Read `protocols/AUTONOMOUS_CONTROLLER.md`, `docs/PAPERS_INTAKE.md`, `docs/COMPREHENSIVE_PRODUCT.md`, `docs/DEPTH_RESTART.md` first
- Papers are **research input** — never same-tick pick→smoke→sustain
- Roles: researcher → product manager → senior architect → **product designer** → product delivery → best-practices tutor
- Require **PM go + Vision/Roadmap/PRD/ERD/blueprint + DESIGN** before `projects/<slug>/`
- Stack: **Next.js + Tailwind + shadcn** (`docs/PRODUCT_STACK.md`); Python sidecar when the claim needs it
- Marketing landing at `/` must sell a **specific buyer outcome** — not a generic lab desk
- **Ban isomorphic desk clones** (noun-swap of jobs/lifecycle/scenario/goldens shells)
- One product at a time; ≥20 real features / ≥8 distinct pages; live `next build` + app-up smoke before finish email
- Always commit, always push to origin/main, always merge own PRs when CI green
- Never rewrite `package.json` with a UTF-8 BOM; use Node writes or `node scripts/strip-json-bom.mjs --check`
- If notify.enabled: email only per `protocols/NOTIFY.md` — story first; Sources footer; full GitHub https URLs

Wake prompt (also in `docs/AUTOMATION.md`):

```text
You are the AI Method Lab controller.
Read CONTROLLER.json first. If paused, stop.
If running: one comprehensive product only — buyer story, selling points, designer pack, then build.
Never isomorphic desk clones. Never pick→smoke same tick.
Mature names. ≥20 real features. Live app smoke before finish email.
Commit push merge. Notify only if enabled.
```

## What to optimize for

Evidence that the workflow can produce **one sophisticated product a stranger would recognize as a product** — not a high count of template desks.

## Hard constraints

1. Research ≠ experiment ≠ promote
2. One product phase in flight at a time
3. Oracles and harness are not writable by the agent under test during a run
4. Midterm method changes must version, redo, and triple-test
5. No confirmation gates between phases when autonomous — **but** `paused` always wins over autonomy
6. No isomorphic dual-gate / desk-template clones

## Pointers

- Portfolio: `projects/PORTFOLIO.md`
- Agent roles: `protocols/AGENT_ROLES.md`
- Product runbook: `protocols/PRODUCT_RUNBOOK.md`
- Workflow: `docs/DEVELOPMENT_WORKFLOW.md`
- Controller: `protocols/AUTONOMOUS_CONTROLLER.md` + `matrix/CONTROLLER.json`
- Email: `protocols/NOTIFY.md`
- Scoring: `docs/RUBRIC.md`
- Backlog: `docs/BACKLOG.md`
- Comprehensive bar: `docs/COMPREHENSIVE_PRODUCT.md`

## Cursor Cloud specific instructions

This repo is a **docs/protocol control-plane** plus **product trees under `projects/`**.

- Validate cell-score JSONs against `harness/cell.schema.json` when scoring.
- Product apps under `projects/<id>/` set up their own deps (Node+TS per CONTROLLER defaults).
- Never edit `oracles/` or `harness/` to make a run pass.
- Prefer committing product source in `projects/` (durable). `sandboxes/` remains gitignored for optional A/B cells.
