# Autonomous controller

**Default mode for this lab.** Experiment by building products under `projects/`. After any product phase finishes (score + findings), immediately start the next phase or next paper pick. Do **not** ask the human to confirm.

Human contact is **email only** for validated ideas and finished products (`protocols/NOTIFY.md`). Hard stops only for credentials / corruption / explicit pause.

## Goal

Prove the workflow can produce **few, deep, comprehensive products** sourced from **simple-papers** digests (`docs/PAPERS_INTAKE.md`). Prefer pick→build over freehand seeds. Use promoted workflow (`docs/DEVELOPMENT_WORKFLOW.md`) inside products. See `docs/DEPTH_RESTART.md` Correction 7.

## State file

Read/write: `matrix/CONTROLLER.json`

| Field | Meaning |
|-------|---------|
| `mode` | `autonomous` \| `paused` \| `hard_stop` |
| `current_cell` / `next_cell` | Phase cell ids |
| `current_product` | Product id under `projects/`, or `null` |
| `current_idea` | Thin seed id / slug, or `null` |
| `phase` | `idle` \| `running` \| `scoring` \| `learning` \| `starting_next` |
| `intake` | `{ source: "simple-papers", mode: "pick_then_build", … }` |
| `ask_human` | Always `false` unless hard stop |
| `notify` | Resend — **only** `idea_validated`, `product_complete`, `hard_stop` |

## Agent roles

| CONTROLLER situation | Role |
|----------------------|------|
| Idle, no `current_product` | **Researcher / picker** — run `scripts/pick-paper-idea.mjs --choose 1`; email validated idea; open `projects/` |
| `phase: running` | **Product designer** + **Product delivery** — DESIGN note; climb ladder on Next.js + Tailwind + shadcn; README + UI never broken |
| Sustain scored | **Best-practices tutor** then email product finished; clear slot; pick next |

Roles detail: `protocols/AGENT_ROLES.md`. Stack: `docs/PRODUCT_STACK.md`. Design: `protocols/DESIGN.md`.

Cap parallel agents at `depth_policy.max_parallel_agents` (default **20**). One product phase at a time.

**Hard sequencing:** do not open a new `projects/` folder until the prior product’s finish email has been sent (or abandon autopsy emailed).

## Loop (one tick)

1. Load `matrix/CONTROLLER.json`. If `mode` is `paused` or `hard_stop`, stop.
2. If `phase` is `running` / `scoring` / `learning` for a cell, **resume that phase**.
3. If idle / no `current_product`: run paper picker (`docs/PAPERS_INTAKE.md`) → scaffold product → email `idea_validated` → set `phase: running` / smoke cell. **Do not** invent freehand seeds. **Do not** wait hours or `ready_to_build`.
4. Execute `protocols/PRODUCT_RUNBOOK.md` for the current product.
5. Score; update portfolio.
6. **Notify** only for idea validated / product complete / hard stop.
7. On sustain: require README + tutor guide + try.html; email product finished; clear pending; return to idle → next pick.

## Hard stops

Set `mode: hard_stop`, `ask_human: true` only for:

1. Secret / credential missing (e.g. Resend)
2. Destructive action outside lab scope
3. Corrupted CONTROLLER that cannot be repaired
4. Explicit human pause / stop

## Merge + ship policy (mandatory)

Commit, push `origin/main`, merge green PRs. Never force-push `main`.

## Saved wake prompt

See `docs/AUTOMATION.md`.
