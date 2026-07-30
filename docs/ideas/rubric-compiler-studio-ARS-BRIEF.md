# Rubric Compiler Studio — ARS brief

Seed paper: [From Rubrics to Reliable Scores: Evidence-Grounded Text Evaluation with LLM Judges](https://arxiv.org/abs/2601.08654) (arXiv:2601.08654).  
Related works: `docs/ideas/rubric-compiler-studio-RELATED-WORKS.json` (OpenAlex + arXiv; no Anthropic key).  
Method: `protocols/ARS_PAPER_RESEARCH.md`.

## Job to be done

Eval / LLM-ops leads need **locked, executable rubrics** that transfer human scoring intent into auditable LLM-judge protocols - not another free-text “be a helpful judge” prompt that drifts every week.

## Unique claim (product)

If we remove **rubric → criteria compiler + evidence checks + scale calibration**, the remaining product collapses into a generic LLM-as-judge playground (already crowded per survey literature below).

## Related landscape (grounded)

| Work | Why it matters |
|------|----------------|
| [Seed RULERS (2601.08654)](https://arxiv.org/abs/2601.08654) | Criteria-transfer framing; evidence-grounded scoring protocol |
| [LLM-Rubric](https://doi.org/10.18653/v1/2024.acl-long.745) | Multidimensional calibrated auto-eval - closest method cousin |
| [From Generation to Judgment](https://doi.org/10.18653/v1/2025.emnlp-main.138) | Category survey; market + research heat for judge tooling |
| [LLMs-as-Judges survey](http://arxiv.org/abs/2412.05579) | Broader eval-methods survey |
| [Principles and Guidelines for LLM Judges](https://doi.org/10.1145/3731120.3744588) | Governance buyer angle for locked rubrics |

Exact records: `docs/ideas/rubric-compiler-studio-RELATED-WORKS.json`. Do not invent citations.

## Buyer wedge

- **Primary:** AI eval leads / platform teams shipping LLM-as-judge loops
- **Money:** seats + usage on rubric versions, calibration runs, audit exports
- **Not:** classroom grading appliances or medical assessment devices

## Gaps vs isomorphic desks

Prior lab desks often noun-swap jobs/lifecycle shells. This claim needs **new invariants**: criterion executability, evidence anchors, calibration drift, selective escalation - not status renames.

## Falsifiers (carry into IDEA_DEPTH G4)

1. Buyers still paste rubrics into ChatGPT and refuse locked versions
2. Domain experts reject compiled criteria as wrong in ≥2 real eval scenarios

## Next

Kill rounds: `docs/ideas/rubric-compiler-studio-KILL-ROUNDS.md`.  
PM pack already exists under `docs/ideas/rubric-compiler-studio-*` - re-check business score under biz-rubric-v2 before climb.
