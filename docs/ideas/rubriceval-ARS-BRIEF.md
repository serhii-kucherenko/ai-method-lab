# RubricEval — ARS brief

Seed: [RubricEval: A Rubric-Level Meta-Evaluation Benchmark for LLM Judges in Instruction Following](https://arxiv.org/abs/2603.25133).  
Related: `docs/ideas/rubriceval-RELATED-WORKS.json`.  
Protocol: `protocols/ARS_PAPER_RESEARCH.md` (no Anthropic key).

## Job to be done

Eval leads need to know **whether the judge got each rubric criterion right** - not only whether the overall score matched a human.

## Unique claim for Rubric Compiler Studio

Adds **Criterion Meta-Eval**: per-criterion judge accuracy, false credit, and rubric-item dashboards. Closes the loop with Judge Health (instrument) + Validity Suite (construct) at item granularity.

## Related landscape (grounded)

| Work | Role |
|------|------|
| Seed RubricEval (2603.25133) | Rubric-level meta-eval benchmark |
| Can LLM-as-a-Judge Reliably Verify Rubrics… — URL in JSON | Rubric verification cousin |
| Support Vector Rubrics / Auto-Rubric as Reward — URLs in JSON | Adjacent rubric/reward work; don’t pivot to RLVR product |
| RUBRIC-ARROW / probabilistic reward aggregation — URLs in JSON | Training-side; fence from eval SaaS spine |

## Buyer wedge

“Which criterion is the judge failing?” is actionable ops - drives rubric edits and escalate rules.

## Recommendation

Fold into Rubric Compiler Studio as **Criterion Meta-Eval**. No standalone climb. Top-10 scoring shortlist is now fully deepened into modules - see `docs/ideas/rubric-compiler-studio-MODULE-MAP.md`.

## Falsifiers

1. Buyers only look at overall scores and ignore per-criterion views
2. Criterion labels in customer rubrics are too messy to meta-eval
