# Rubric

Score every cell `(approach × project)` the same way. Harness lives under `harness/`; oracles under `oracles/`. Agents must not edit either during a run.

## Primary metrics

| Metric | Per cell | Across projects (approach score) |
|--------|----------|----------------------------------|
| Correctness | Oracle + contracts green | % projects passed; fail severity |
| Cycle time | Idea → merge (hours) | Median / p90 by tier |
| Interventions | Human unblocks | Mean per project; spikes by tier |
| Regression safety | Prior suite still green | Holdout failures |
| Reviewability | PR size, artifact links, review turns | Consistency of reviewability |
| Recoverability | Clean retry from last good gate | Resume failures |
| Scale / fail locus | Stage tag on break | Heatmap stage × tier |
| Team fit | Simulated 1/2/3/5 friction | Viable sizes |
| Cost | Tokens / $ / wall time | Efficiency vs quality |

## Secondary (logged, not primary rank)

Token cost, wall-clock agent time, doc drift, security findings, post-merge reverts.

## Promotion (method becomes a default candidate)

Eligible only if:

1. Correctness + regression targets met on ≥ 2 project tiers
2. Interventions within team-size budget
3. Cycle time within agreed tolerance of baseline (or justified quality gain)
4. Pros/cons + failure modes written in FINDINGS
5. Explicit decision recorded (human or scored auto-promote)
6. If midterm-changed: new version triple-tested; old cells marked superseded
