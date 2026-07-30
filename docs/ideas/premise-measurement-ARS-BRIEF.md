# PReMISE method — ARS brief

Seed: [PReMISE: Policy Rubrics as Measurement Specifications for LLM Judges](https://arxiv.org/abs/2605.30803).  
Related: `docs/ideas/premise-measurement-RELATED-WORKS.json`.  
Protocol: `protocols/ARS_PAPER_RESEARCH.md` (no Anthropic key).

## Job to be done

Eval leads need rubrics that behave like **measurement specifications** - locked policy that turns vague “be helpful” into scoreable, auditable criteria - not prompt prose that drifts.

## Unique claim vs RULERS / Autorubric

| Paper | Spine |
|-------|--------|
| RULERS | Criteria-transfer + evidence-grounded protocols |
| Autorubric | Production cookbook (types, ensembles, bias, psychometrics) |
| **PReMISE** | Rubrics as **policy / measurement specs** (governance object) |

Product implication for Rubric Compiler Studio: versioned rubrics should be first-class **policy artifacts** (who locked what, when, against which eval suite) - not only compiler IR.

## Related landscape (grounded)

| Work | Role |
|------|------|
| Seed PReMISE (2605.30803) | Measurement-spec framing for LLM judges |
| [RULERS](https://arxiv.org/abs/2601.08654) | Closest method cousin in related-works |
| [Autorubric](https://arxiv.org/abs/2603.00077) | Recipe surface; complementary |
| Other JSON hits (healthcare MedJUDGE, etc.) | Noise / adjacent - do not invent product lines from them |

Exact URLs: RELATED-WORKS JSON only.

## Buyer wedge

Same ICP (eval platform teams). PReMISE strengthens the **policy lock + audit trail** story for seats that care about compliance and eval governance.

## Recommendation

Fold into Rubric Compiler Studio as **Measurement Spec / Policy Lock** module. Do not open a `premise-*` product climb.

## Falsifiers

1. Buyers treat “measurement spec” as jargon and only buy raw judge runs
2. Policy lock without SME workflow still fails G3 kill #3 (offline politics)
