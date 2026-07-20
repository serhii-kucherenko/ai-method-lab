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
- Saved automation text: `docs/AUTOMATION.md`
- OS stages: `docs/OS.md`
- Scoring: `docs/RUBRIC.md`
- Next work: `docs/BACKLOG.md`
- How to run a cell: `protocols/RUNBOOK.md`
