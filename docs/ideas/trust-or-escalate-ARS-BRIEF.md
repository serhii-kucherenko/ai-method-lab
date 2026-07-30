# Trust or Escalate method — ARS brief

Seed: [Trust or Escalate: LLM Judges with Provable Guarantees for Human Agreement](https://arxiv.org/abs/2407.18370).  
Related: `docs/ideas/trust-or-escalate-RELATED-WORKS.json`.  
Protocol: `protocols/ARS_PAPER_RESEARCH.md` (no Anthropic key).

## Job to be done

Eval leads need **when to trust the judge vs escalate to a human** - with guarantees tied to human agreement - not a always-on LLM score that silently drifts.

## Unique claim for Rubric Compiler Studio

RULERS/Autorubric/PReMISE cover compile / recipe / policy lock. This paper adds **selective scoring**: cheap→strong cascade + abstention/escalation with provable human-agreement framing. Product module: **Escalate Gate** (confidence / disagreement → human queue).

## Related landscape (grounded)

| Work | Role |
|------|------|
| Seed Trust or Escalate (2407.18370) | Selective LLM judges + human-agreement guarantees |
| Know Your Limits (abstention survey) — URL in JSON | Abstention literature maps to escalate UX |
| LLM-as-a-Judge surveys — URLs in JSON | Category context |
| Collaborative Human-AI Decision Making — URL in JSON | Human-in-the-loop buyer language |

Exact URLs: RELATED-WORKS JSON only.

## Buyer wedge

Same ICP. Escalation queues are a retention hook (ops seats) once rubrics are locked.

## Recommendation

Fold into Rubric Compiler Studio as **Selective Trust / Escalate** surface. Do not open a separate product climb.

## Falsifiers

1. Buyers ignore escalate queues and auto-accept all scores
2. “Provable guarantees” cannot be productized without academic cosplay buyers reject
