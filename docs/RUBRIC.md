# Rubric

Score every cell `(approach × project)` the same way. Harness lives under `harness/`; oracles under `oracles/`. Agents must not edit either during a run.

Human steer (2026-07-23): improve scoring so **maturity and sophistication** beat pass-count theater and ugly naming.

## Primary metrics

| Metric | Per cell | Across projects (approach score) |
|--------|----------|----------------------------------|
| Correctness | Oracle + contracts green | % projects passed; fail severity |
| **Maturity** | Display name human; ≥15 features live; ≥6 pages; tutor guide present | Share of products meeting maturity bar |
| **Sophistication** | Unique domain claim still true at sustain; not isomorphic clone | Clone-kill rate; depth of domain tests |
| Cycle time | Idea → merge (hours) — slower OK if maturity rises | Median / p90 by tier |
| Interventions | Human unblocks | Mean per project; spikes by tier |
| Regression safety | Prior suite still green | Holdout failures |
| Reviewability | PR size, artifact links, review turns, **guide link** | Consistency |
| Recoverability | Clean retry from last good gate | Resume failures |
| Scale / fail locus | Stage tag on break | Heatmap stage × tier |
| Team fit | Simulated 1/2/3/5 friction | Viable sizes |
| Cost | Tokens / $ / wall time | Efficiency vs quality |

## Maturity gate (product sustain)

Sustain scores **fail** (even if tests green) when any of:

1. Public brand is a statute code / glue-noun (`docs/PRODUCT_NAMING.md`)
2. Fewer than **15** user-visible features or **6** pages
3. No tutor guide under `docs/guides/` for this product
4. Digests are pass-count only (no story / money honesty)

## Secondary (logged, not primary rank)

Token cost, wall-clock agent time, doc drift, security findings, post-merge reverts, leftover ugly internal ids in UI copy.

## Promotion (method becomes a default candidate)

Eligible only if:

1. Correctness + regression + **maturity** targets met on ≥ 2 project tiers
2. Interventions within team-size budget
3. Cycle time within agreed tolerance of baseline (or justified quality gain)
4. Pros/cons + failure modes written in FINDINGS **and** a tutor guide
5. Explicit decision recorded (human **or** scored auto-promote when `defaults.auto_promote: true` in CONTROLLER.json)
6. If midterm-changed: new version triple-tested; old cells marked superseded
