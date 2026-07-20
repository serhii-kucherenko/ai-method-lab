# Triple-test

Before a new or revised approach version counts toward promotion:

## Option A — Replication

Same approach × same brief, **3 independent runs**. Use median metrics; record spread.

## Option B — Triad (when failure mode is specific)

1. Smoke (or original brief)
2. One harder sibling tier
3. One failure-injection / edge case aimed at the bug you fixed

## Promote if

- ≥ **2 of 3** pass the primary oracle
- No new **critical** failure tag appears
- FINDINGS lists what changed and what was invalidated

## Record

In each cell JSON: `replication_group`, `run_index` (1–3), `triple_test: true`.
