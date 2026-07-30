# Reliability without Validity — ARS brief

Seed: [Reliability without Validity: A Systematic, Large-Scale Evaluation of LLM-as-a-Judge Models Across Agreement, Consistency, and Bias](https://arxiv.org/abs/2606.19544).  
Related: `docs/ideas/reliability-without-validity-RELATED-WORKS.json`.  
Protocol: `protocols/ARS_PAPER_RESEARCH.md` (no Anthropic key).

## Job to be done

Eval leads need protocols that separate **agreement/consistency** from **validity** - exact-match agreement alone misleads when the judge is stably wrong.

## Unique claim for Rubric Compiler Studio

Complements Judge Health (IRT) and Bias Hardening: add **Validity Suite** - human gold anchors, construct checks, and “high agreement ≠ good measure” warnings in the product UI and reports.

## Related landscape (grounded)

| Work | Role |
|------|------|
| Seed Reliability without Validity (2606.19544) | Large-scale agreement/consistency/bias vs validity warning |
| LLM-as-a-Judge surveys — URLs in JSON | Category context |
| From Generation to Judgment — URL in JSON | Field map |
| Healthcare human-eval framework hits in JSON | Noise - refuse clinical climbs |

## Buyer wedge

Same ICP. “Green agreement, bad product decisions” is a painful failure mode for eval platforms - a validity story sells against naive scoreboards.

## Recommendation

Fold into Rubric Compiler Studio as **Validity Suite** (alongside reliability diagnostics). No standalone climb.

## Falsifiers

1. Buyers only pay for agreement dashboards and ignore validity warnings
2. Validity checks require gold sets buyers refuse to maintain
