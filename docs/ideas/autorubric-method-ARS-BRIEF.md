# Autorubric method — ARS brief

Seed: [Autorubric: Unifying Rubric-based LLM Evaluation](https://arxiv.org/abs/2603.00077).  
Related: `docs/ideas/autorubric-method-RELATED-WORKS.json`.  
Protocol: `protocols/ARS_PAPER_RESEARCH.md` (no Anthropic key).

## Job to be done

Eval leads want a **single production recipe** for rubric-based LLM evaluation: criterion types, ensembles, few-shot calibration, bias mitigations, psychometric metrics - not a pile of one-off judge prompts.

## Unique claim vs Rubric Compiler / RULERS

RULERS emphasizes criteria-transfer + evidence-grounded protocols. Autorubric emphasizes a **unified production cookbook**. Product should absorb Autorubric’s recipe surface (criterion taxonomy, ensemble, bias pack) without becoming a paper soft-sim of either.

## Related landscape (grounded)

| Work | Role |
|------|------|
| Seed Autorubric (2603.00077) | Unifying recipe for rubric LLM eval |
| AutoRubric generative rewards (see JSON) | Adjacent name; multimodal RL rewards - differentiate carefully |
| Agreement Metrics for LLM-as-Judge | What to report for reliability |
| Policy-aware / expert rubrics for RLVR | Shows rubrics spreading into RL - optional later surface |
| Meta-rubrics / GAMUT | Open-ended generation evaluation |

URLs in RELATED-WORKS JSON only.

## Buyer wedge

Same ICP as Rubric Compiler Studio (eval platform teams). Autorubric informs **feature checklist** for the recipe UI, not a second isomorphic product.

## Recommendation

Do **not** open a second `autorubric-*` product folder. Fold insights into Rubric Compiler Studio blueprint / ROADMAP as recipe modules. Kill a separate climb unless the money hook differs.

## Falsifiers

1. Cookbook features don’t change buyer retention vs plain judge runner
2. Experts reject criterion taxonomy as academic cosplay
