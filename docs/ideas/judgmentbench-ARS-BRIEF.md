# JudgmentBench — ARS brief

Seed: [JudgmentBench: Comparing Rubric and Preference Evaluation for Quality Assessment](https://arxiv.org/abs/2605.25240).  
Related: `docs/ideas/judgmentbench-RELATED-WORKS.json` (arXiv-enriched; OpenAlex neighbors were weak).  
Protocol: `protocols/ARS_PAPER_RESEARCH.md` (no Anthropic key).

## Job to be done

Eval leads need evidence for **when to use rubric scoring vs preference/pairwise judging** - a decision surface in the product, not tribal defaults.

## Unique claim for Rubric Compiler Studio

Adds **Mode Compare**: head-to-head rubric vs preference runs on the same suite, with guidance on which mode fits the task. Complements Bias Hardening (pointwise vs pairwise position bias papers in related works).

## Related landscape (grounded)

| Work | Role |
|------|------|
| Seed JudgmentBench (2605.25240) | Rubric vs preference benchmark |
| Rubrics as an Attack Surface / preference drift — URL in JSON | Security of rubric judges |
| Pointwise vs pairwise position bias — URL in JSON | Mode-specific bias |
| Assessing LLM-as-a-Judge / meta-judges — URLs in JSON | Meta-eval context |

## Buyer wedge

Helps buyers choose eval mode per workflow - reduces wrong-tool failures (“we only did pairwise and missed criterion failures”).

## Recommendation

Fold into Rubric Compiler Studio as **Mode Compare / rubric vs preference**. No standalone climb.

## Falsifiers

1. Buyers always pick one mode and never compare
2. Bench results don’t transfer to customer domains
