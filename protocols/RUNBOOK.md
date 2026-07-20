# Runbook — one cell

## 1. Pick cell

From `docs/BACKLOG.md`. Mark **in progress**. Only one cell at a time.

## 2. Freeze inputs

Pin:

- Approach card path (e.g. `approaches/A01.md`)
- Brief (`projects/briefs/...`)
- Oracle (`oracles/...`)

Do not edit approach/oracle mid-run. If you must change method → stop and follow `MIDTERM_CHANGE.md`.

## 3. Spin sandbox

```text
sandboxes/<cell-id>/
```

New folder or worktree. Record path in the cell JSON.

## 4. Execute

Follow the approach card through `docs/OS.md` stages. Log interventions (human unblocks).

## 5. Score

Fill `matrix/cells/<cell-id>.json` using `harness/cell.schema.json` fields. Run any harness checks available.

## 6. Learn

Append to `matrix/FINDINGS.md`. Update leaderboard. Queue next cell from learning rules. Update `matrix/CONTROLLER.json`.

## 7. Notify (if enabled)

If `matrix/CONTROLLER.json` → `notify.enabled`, send via Resend per `protocols/NOTIFY.md` (cell and/or wave events). Failures are non-blocking.

## 8. Close + continue (autonomous)

Mark backlog item done. **Commit, push to `origin/main`, and merge** any open controller PR in the same tick. Never end with unpushed commits.

**Do not wait for human confirmation.** Immediately start the next queued cell per `protocols/AUTONOMOUS_CONTROLLER.md` unless `mode` is `paused` or `hard_stop`.
