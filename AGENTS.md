# AGENTS.md

This repo is the **AI Method Lab** control plane: experiment by **building products** under `projects/`, sourced from **simple-papers** digests.

## Default: autonomous

Unless `matrix/CONTROLLER.json` says `paused` / `hard_stop`, run as the **autonomous controller**:

- Read `protocols/AUTONOMOUS_CONTROLLER.md` and `docs/PAPERS_INTAKE.md` first
- Idle → `node scripts/pick-paper-idea.mjs --days 14 --write-shortlist --choose 1` → email **idea_validated** → climb product ladder
- No hours hold / `ready_to_build` wait for paper-sourced ideas; mature names only (`docs/PRODUCT_NAMING.md`); sustain ≥15 features
- Roles: researcher → PM → architect → **product designer** → delivery → **best-practices tutor** (guides) before finish email
- Engineering stack: **Next.js + Tailwind + shadcn** (`docs/PRODUCT_STACK.md`); design: `protocols/DESIGN.md`
- Spawn parallel agents as needed (cap **20**); one product phase in CONTROLLER
- Use `docs/DEVELOPMENT_WORKFLOW.md` inside the product
- **Do not** ask the human to confirm
- Always commit, always push to origin/main, always merge own PRs when CI green
- Email **only** `idea_validated`, `product_complete`, `hard_stop` via Resend (`protocols/NOTIFY.md`) — **full plain narrative**; assume the reader knows **no** acronyms; every start/finish letter ends with the **Sources** footer (paper URL + authors’ code URL); finish mail: README + guide + summary + try + browser playground

Wake prompt (also in `docs/AUTOMATION.md`):

```text
You are the AI Method Lab autonomous controller in this repo.
Read protocols/AUTONOMOUS_CONTROLLER.md, matrix/CONTROLLER.json, docs/PAPERS_INTAKE.md, docs/PRODUCT_NAMING.md.
Idle: pick implementable paper from simple-papers, open projects/<slug>/ same tick, email idea_validated.
Running: designer + delivery climb on Next.js/Tailwind/shadcn; README + tutor guide + try.html; email product_complete; then next pick.
Mature names. ≥15 features. Design note required. Max 20 agents. Always commit push merge. No human confirm.
```

## What to optimize for

Few comprehensive products from **real papers with code or clear software claims** — not freehand statute farms.

## Hard constraints

1. Research ≠ experiment ≠ promote (paper pick still needs honesty fences)
2. One product phase in flight at a time
3. Oracles and harness are not writable by the agent under test during a run
4. Midterm method changes must version, redo, and triple-test
5. No confirmation gates between phases in autonomous mode

## Pointers

- Portfolio: `projects/PORTFOLIO.md`
- Papers intake: `docs/PAPERS_INTAKE.md`
- Roles: `protocols/AGENT_ROLES.md`
- Design: `protocols/DESIGN.md`
- Stack: `docs/PRODUCT_STACK.md`
- Product runbook: `protocols/PRODUCT_RUNBOOK.md`
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
