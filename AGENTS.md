# AGENTS.md

This repo is the **AI Method Lab** control plane.

## Default: autonomous

Unless `matrix/CONTROLLER.json` says `paused` / `hard_stop`, run as the **autonomous controller**:

- Read `protocols/AUTONOMOUS_CONTROLLER.md` first
- After each approach cell is scored, **immediately** start the next backlog cell
- **Do not** ask the human to confirm, pick the next approach, or approve continuing
- Only stop for hard stops listed in the controller protocol

Wake prompt (also in `docs/AUTOMATION.md`):

```text
You are the AI Method Lab autonomous controller in this repo.
Read protocols/AUTONOMOUS_CONTROLLER.md and matrix/CONTROLLER.json.
Resume or start the next experiment cell. Do not ask for confirmation.
Follow approaches/, projects/briefs/, oracles/, protocols/RUNBOOK.md.
After scoring, immediately continue to the next backlog cell.
Only hard-stop per AUTONOMOUS_CONTROLLER.md.
Commit meta-repo updates (matrix, backlog, controller) after each cell.
Always commit, always push to origin/main, always merge own PRs when CI green — same tick, no human gate.
If notify.enabled, email digests via Resend MCP per protocols/NOTIFY.md.
If you open a PR, merge it yourself when checks pass — do not wait for a human.
```

## What to optimize for

Evidence about development approaches across many sandbox projects — not shipping one customer product from this repo.

## Hard constraints

1. Research ≠ experiment ≠ promote
2. One experiment cell at a time
3. Oracles and harness are not writable by the agent under test during a run
4. Midterm method changes must version, redo, and triple-test
5. No confirmation gates between cells in autonomous mode

## Pointers

- Controller: `protocols/AUTONOMOUS_CONTROLLER.md` + `matrix/CONTROLLER.json`
- Email digests: `protocols/NOTIFY.md` (Resend MCP; findings + usage guide on ladder_complete)
- Saved automation text: `docs/AUTOMATION.md`
- OS stages: `docs/OS.md`
- Scoring: `docs/RUBRIC.md`
- Next work: `docs/BACKLOG.md`
- How to run a cell: `protocols/RUNBOOK.md`

## Cursor Cloud specific instructions

This repo is a **docs/protocol control-plane**, not an application: there is no source
code, package manager, build step, or test suite. The only machine-checkable artifacts
are the two JSON files (`matrix/CONTROLLER.json`, `harness/cell.schema.json`) plus the
markdown protocols. Node and Python are preinstalled on the pod.

- The closest thing to lint/test here is JSON validity + validating cell-score JSONs
  (`matrix/cells/*.json`, template in `harness/SCORE_TEMPLATE.md`) against
  `harness/cell.schema.json`. `jsonschema` is available (installed by the update script);
  validate a cell with `jsonschema.Draft202012Validator(schema).validate(cell)`.
- "Running the app" means executing the controller loop by hand: read `matrix/CONTROLLER.json`,
  follow `protocols/AUTONOMOUS_CONTROLLER.md` + `protocols/RUNBOOK.md`. Nothing to serve.
- Experiment cells create real runnable projects under `sandboxes/<cell-id>/` (gitignored;
  Node+TS+Vitest per `CONTROLLER.json.defaults`). Those per-cell product builds set up their
  own deps and are **not** part of this repo's environment.
- Never edit `oracles/` or `harness/` to make a run pass (hard constraint 3).
