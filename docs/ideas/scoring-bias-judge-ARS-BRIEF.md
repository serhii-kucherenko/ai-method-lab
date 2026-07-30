# Scoring bias in LLM judges — ARS brief

Seed: [Evaluating Scoring Bias in LLM-as-a-Judge](https://arxiv.org/abs/2506.22316).  
Related: `docs/ideas/scoring-bias-judge-RELATED-WORKS.json`.  
Protocol: `protocols/ARS_PAPER_RESEARCH.md` (no Anthropic key).

## Job to be done

Eval leads need to catch **scoring-mode biases** (rubric order, score IDs, reference-answer anchoring) - not only pairwise preference bias that most judge tools already mention.

## Unique claim for Rubric Compiler Studio

Modules so far: compile, recipe, policy lock, escalate, judge health. This adds **Bias Hardening**: shuffle/order controls, score-label hygiene, reference-answer isolation tests as first-class eval gates.

## Related landscape (grounded)

| Work | Role |
|------|------|
| Seed scoring-bias paper (2506.22316) | Scoring-mode bias taxonomy for LLM judges |
| Humans or LLMs as the Judge? Judgement Bias — URL in JSON | Bias cousin |
| MT-Bench / Chatbot Arena + G-Eval — URLs in JSON | Canonical judge eval baselines |
| From Generation to Judgment survey — URL in JSON | Category map |
| Clinical / medical JSON hits | Noise - refuse per biz-rubric-v2 |

## Buyer wedge

Same ICP. Bias packs are table-stakes once locked rubrics ship - reduces “why did scores flip after we renamed levels?” incidents.

## Recommendation

Fold into Rubric Compiler Studio as **Bias Hardening** checks. No standalone climb.

## Falsifiers

1. Buyers never enable bias suites because they slow CI
2. Bias findings aren’t actionable (no auto-fix / re-order tooling)
