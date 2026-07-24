# FINDINGS — Secure Tutor Studio

## Dual score
- **A (orchestrated):** multi-LLM explainer → safety → rubric handoffs with pedagogy depth and safety gates
- **B (single):** unchecked single-LLM baseline that degrades under threat pressure and exploit-hint risk

## Observations
- Orchestration lift grows with tutor coverage, safety specialization, and coordination rounds.
- Single-LLM scores look competitive on easy topics but collapse when exploit-hint risk and student risk rise.
- Rubric item count alone does not rescue the single path without safety specialization.

## Honesty
Soft simulation for method-lab evaluation. Inspired by arXiv:2607.14601 — never branded as SYNAPSE. Not a live classroom product.
