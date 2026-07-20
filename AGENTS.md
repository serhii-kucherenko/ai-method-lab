# AGENTS.md

This repo is the **AI Method Lab** control plane: experiment by **building products** under `projects/`.

## Default: autonomous

Unless `matrix/CONTROLLER.json` says `paused` / `hard_stop`, run as the **autonomous controller**:

- Read `protocols/AUTONOMOUS_CONTROLLER.md` first
- Primary work: grow the current product in `projects/` per `protocols/PRODUCT_RUNBOOK.md`
- Use `docs/DEVELOPMENT_WORKFLOW.md` (promoted A03 + A10) inside the product
- After each phase is scored, **immediately** start the next phase or next queued product
- **Do not** ask the human to confirm
- Always commit, always push to origin/main, always merge own PRs when CI green
- If notify.enabled, email digests via Resend MCP — link `docs/DEVELOPMENT_WORKFLOW.md` and product FINDINGS

Wake prompt (also in `docs/AUTOMATION.md`):

```text
You are the AI Method Lab autonomous controller in this repo.
Read protocols/AUTONOMOUS_CONTROLLER.md and matrix/CONTROLLER.json.
Resume or start the next product phase under projects/. Do not ask for confirmation.
Follow projects/PORTFOLIO.md, protocols/PRODUCT_RUNBOOK.md, docs/DEVELOPMENT_WORKFLOW.md.
After scoring a phase, immediately continue to the next phase or product.
Only hard-stop per AUTONOMOUS_CONTROLLER.md.
Commit meta-repo updates after each phase. Always commit, always push, always merge.
If notify.enabled, email digests via Resend MCP per protocols/NOTIFY.md — link docs/DEVELOPMENT_WORKFLOW.md (not lab usage guide).
If you open a PR, merge it yourself when checks pass — do not wait for a human.
```

## What to optimize for

Evidence that a workflow can produce **comprehensive, sustainable products** — many projects over time. `projects/` is the testing folder.

## Hard constraints

1. Research ≠ experiment ≠ promote
2. One product phase in flight at a time
3. Oracles and harness are not writable by the agent under test during a run
4. Midterm method changes must version, redo, and triple-test
5. No confirmation gates between phases in autonomous mode

## Pointers

- Portfolio: `projects/PORTFOLIO.md`
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
