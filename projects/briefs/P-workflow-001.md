# P-workflow-001 — Approvals state machine

```yaml
id: P-workflow-001
tier: P-workflow
effort: 1–2 weeks
oracle: oracles/P-workflow-001.md
```

## Goal

Request → review → approve/reject → (optional) revise loop with audit trail.

## In scope

- Explicit states and legal transitions
- Reject illegal transitions
- Audit log of who changed state when
- Concurrent update / version conflict handling (optimistic locking or equivalent)

## Out of scope

- Full BPM engine, SLA timers UI, multi-org routing

## Success metric

Oracle green on transitions + concurrency case; no silent illegal jumps.

## Stress focus

Edge cases, consistency, recoverability under conflict.
