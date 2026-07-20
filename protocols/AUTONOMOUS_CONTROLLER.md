# Autonomous controller

**Default mode for this lab.** After any approach cell finishes (score + findings written), immediately start the next queued cell. Do **not** ask the human to confirm, approve the next approach, or wait for “continue.”

Human contact is allowed only for **hard stops** (see below).

## Goal

Fill the wave-1 smoke column (A01–A10 × P-smoke-001), then ladder per FINDINGS — unattended as far as possible.

## State file

Read/write: `matrix/CONTROLLER.json`

| Field | Meaning |
|-------|---------|
| `mode` | `autonomous` \| `paused` \| `hard_stop` |
| `current_cell` | Cell id in flight, or `null` |
| `phase` | `idle` \| `running` \| `scoring` \| `learning` \| `starting_next` |
| `next_cell` | Next backlog cell id |
| `last_completed` | Last scored cell id |
| `ask_human` | Always `false` unless hard stop |
| `hard_stop_reason` | Set only on hard stop |

## Loop (one tick)

1. Load `matrix/CONTROLLER.json`. If `mode` is `paused` or `hard_stop`, stop (do not ask; leave reason in state + FINDINGS).
2. If `phase` is `running` / `scoring` / `learning` for `current_cell`, **resume that cell** — do not start another.
3. If idle and no current cell:
   - Take the highest-priority **queued** row from `docs/BACKLOG.md`
   - Set `current_cell`, `phase: running`, mark backlog **in progress**
4. Execute `protocols/RUNBOOK.md` for that cell (sandbox → approach rules → verify vs oracle).
5. Write `matrix/cells/<id>.json`, update `matrix/leaderboard.md` + `matrix/FINDINGS.md`.
6. Mark backlog row **done**. Set `last_completed`, clear `current_cell`, `phase: starting_next`.
7. **Without waiting:** pick next queued cell and go to step 3.
8. If backlog smoke column is empty: write FINDINGS “wave-1 smoke complete”, queue top-5 × harder tiers per FINDINGS, continue unless `mode` flipped.

## Mid-cell failure

- Approach/process bug → `protocols/MIDTERM_CHANGE.md` + `protocols/TRIPLE_TEST.md`, then continue autonomously.
- Sandbox flaky → retry same cell up to **2** times; then tag fail, score as fail, move on (still no human ask).

## Hard stops (only times to stop unattended work)

Set `mode: hard_stop`, `ask_human: true`, reason in state + FINDINGS:

1. Secret / credential required that is not in the environment
2. Destructive action outside sandboxes/ (e.g. force-push, deleting unrelated repos)
3. Controller JSON corrupted and cannot be repaired safely
4. Explicit human message: pause / stop

Otherwise: **never** pause for preference questions, naming, stack choice, or “should I continue?”

## Defaults when the approach card is silent

- Stack for P-smoke: Node + TypeScript, simple HTTP API, in-memory or SQLite, Vitest or node:test
- License/docs: minimal README in sandbox only
- Commit inside sandbox after green tests; meta-repo: commit score + findings + controller state after each cell

## Saved wake prompt (paste into Automations /loop / new agent)

```text
You are the AI Method Lab autonomous controller in this repo.
Read protocols/AUTONOMOUS_CONTROLLER.md and matrix/CONTROLLER.json.
Resume or start the next experiment cell. Do not ask for confirmation.
Follow approaches/, projects/briefs/, oracles/, protocols/RUNBOOK.md.
After scoring, immediately continue to the next backlog cell.
Only hard-stop per AUTONOMOUS_CONTROLLER.md.
Commit meta-repo updates (matrix, backlog, controller) after each cell.
```

## Cursor Automation (recommended)

Schedule this wake prompt on a timer (e.g. hourly) against this repo’s `main` so runs continue even when chat is closed. Prefer enabling memory so consecutive runs share context.
