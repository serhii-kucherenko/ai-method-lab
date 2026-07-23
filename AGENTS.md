# AGENTS.md

This repo is the **AI Method Lab** control plane: experiment by **building products** under `projects/`.

## Default: autonomous

Unless `matrix/CONTROLLER.json` says `paused` / `hard_stop`, run as the **autonomous controller**:

- Read `protocols/AUTONOMOUS_CONTROLLER.md` first
- Drive work through `protocols/AGENT_ROLES.md`: **researcher** → **product manager** → **senior architect** → **product delivery** → **best-practices tutor** (guides). Mature names only (`docs/PRODUCT_NAMING.md`). Sustain requires **≥15 features**.
- If `phase` is `research` / ideation: follow `protocols/IDEA_DEPTH.md` + `docs/BACKLOG.md` — **no new product code**
- Else: grow the current product in `projects/` per `protocols/PRODUCT_RUNBOOK.md` through sustain; **tutor guide + email findings before switching products**
- Spawn parallel role agents as needed (cap **20**); still one product phase in CONTROLLER
- Use `docs/DEVELOPMENT_WORKFLOW.md` (promoted A03 + A10) inside the product
- After each phase is scored, **immediately** continue — next product only after guide + findings email
- **Do not** ask the human to confirm
- Always commit, always push to origin/main, always merge own PRs when CI green
- If notify.enabled, email digests via Resend MCP per `protocols/NOTIFY.md` — **story first**, plain language, no acronyms; product finished includes try-page + StackBlitz

Wake prompt (also in `docs/AUTOMATION.md`):

```text
You are the AI Method Lab autonomous controller in this repo.
Read protocols/AUTONOMOUS_CONTROLLER.md, matrix/CONTROLLER.json, docs/DEPTH_RESTART.md, docs/PRODUCT_NAMING.md.
Roles: researcher → product manager → senior architect → product delivery → best-practices tutor. Mature human names. ≥15 features. Roadmap before build. Guide + email before next product. Max 20 parallel agents.
If phase is research: deepen current_idea — no product folders until ready_to_build + PM go.
Otherwise resume the product under projects/. Do not ask for confirmation.
Fewer mature products. Kill isomorphic dual-gate clones and statute-code brands on sight.
Follow projects/PORTFOLIO.md, docs/BACKLOG.md, protocols/PRODUCT_RUNBOOK.md, docs/DEVELOPMENT_WORKFLOW.md.
Only hard-stop per AUTONOMOUS_CONTROLLER.md.
Commit after each tick. Always commit, always push, always merge.
If notify.enabled, email digests via Resend MCP per protocols/NOTIFY.md — story first; product finished: try page + StackBlitz.
If you open a PR, merge it yourself when checks pass — do not wait for a human.
```

## What to optimize for

Evidence that a workflow can produce **few, comprehensive, well-verified products** — not a high count of shallow sustains. Prefer slow idea depth (`protocols/IDEA_DEPTH.md`) over starting the next project. `projects/` is the testing folder for ideas that already cleared depth gates.

## Hard constraints

1. Research ≠ experiment ≠ promote
2. One product phase in flight at a time
3. Oracles and harness are not writable by the agent under test during a run
4. Midterm method changes must version, redo, and triple-test
5. No confirmation gates between phases in autonomous mode

## Pointers

- Portfolio: `projects/PORTFOLIO.md`
- Agent roles: `protocols/AGENT_ROLES.md`
- Product runbook: `protocols/PRODUCT_RUNBOOK.md`
- Workflow: `docs/DEVELOPMENT_WORKFLOW.md`
- Controller: `protocols/AUTONOMOUS_CONTROLLER.md` + `matrix/CONTROLLER.json`
- Email: `protocols/NOTIFY.md`
- Scoring: `docs/RUBRIC.md`
- Backlog: `docs/BACKLOG.md`

## Cursor Cloud specific instructions

This repo is a **docs/protocol control-plane** plus **product trees under `projects/`**.

- Validate cell-score JSONs against `harness/cell.schema.json` when scoring.
- Product apps under `projects/<id>/` set up their own deps (Node+TS per CONTROLLER defaults).
- Never edit `oracles/` or `harness/` to make a run pass.
- Prefer committing product source in `projects/` (durable). `sandboxes/` remains gitignored for optional A/B cells.
