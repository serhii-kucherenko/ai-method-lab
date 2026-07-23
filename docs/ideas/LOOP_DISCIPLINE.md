# Loop discipline (do not break)

## Failure that looked like “idle loops”

On 2026-07-21 the agent repeatedly **killed and re-armed** the 30m keep-going loop when the human reissued `/loop`. Each re-arm **restarts the 1800s sleep**, so **no `AGENT_LOOP_TICK_*` sentinel ever fired**. Session chat work continued, but scheduled wakes did not — which reads as “nothing happened in the last couple of loops.”

## Rules

1. **If a matching depth loop is already running, do not restart it.** Only update CONTROLLER notes.
2. Re-arm only when the process is **dead** or the human explicitly says to replace the loop (e.g. `/loop 15m` replacing a 30m depth loop).
3. On each wake: do a **material** queue item (fixtures that teach something, scorecard flip, product phase) — not park-note spam.
4. “Same-day no build” is not “same-day no work.” Research/testing must still advance.
5. Prefer **one** depth keep-going loop. Parallel **agents/tasks** are fine; duplicate sleepers with the same sentinel are not.
6. Current depth sentinel (2026-07-23 Correction 6): `AGENT_LOOP_TICK_mature_15m` every **15m** (mature names + tutor + ≥15 features; replaced `robust_15m`).
7. If the loop process **exits**, re-arm once — recovery, not a timer reset on a live sleeper.
8. Parallel agents capped at **20**. Finish + guide + email before next product.
