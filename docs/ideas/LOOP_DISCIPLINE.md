# Loop discipline (do not break)

## Failure that looked like “idle loops”

On 2026-07-21 the agent repeatedly **killed and re-armed** the 30m keep-going loop when the human reissued `/loop`. Each re-arm **restarts the 1800s sleep**, so **no `AGENT_LOOP_TICK_*` sentinel ever fired**. Session chat work continued, but scheduled wakes did not — which reads as “nothing happened in the last couple of loops.”

## Rules

1. **If a matching depth loop is already running, do not restart it.** Only update CONTROLLER notes.
2. Re-arm only when the process is **dead** or the human explicitly says to replace the loop.
3. On each wake: do a **material** queue item (fixtures that teach something, scorecard flip, product phase) — not park-note spam.
4. “Same-day no build” is not “same-day no work.” Research/testing must still advance.
5. If the loop process **exits** (exit code non-zero / no PID), re-arm once — that is recovery, not a timer reset on a live sleeper.
