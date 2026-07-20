# Oracle — P-workflow-001

Agents must not edit this file during a cell run.

## Required behaviors

1. Only legal state transitions succeed
2. Illegal transitions fail clearly
3. Audit log records actor + from/to + timestamp
4. Concurrent conflicting updates do not corrupt state (one wins or both fail cleanly)

## Fail tags

`illegal-transition` · `no-audit` · `race-corrupt` · `approach-violation`
