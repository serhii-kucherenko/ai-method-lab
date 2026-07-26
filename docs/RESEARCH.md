# Research log

Papers-driven lab. No freehand product farms.

## 2026-07-24 � Data World Studio finished; Neuro Guard Studio started

Data World Studio sustain-green (`1af8fbe`); finish email sent (`2f6f779f`). Next unused score-2 pick: **Neuro Guard Studio** from paper `2607.09076` (neuro-agentic IIoT defense + counterfactual physics; no public code). PM + design pack written; climb next.

## 2026-07-24 � Ladder Bomb Studio finished; Data World Studio started

Ladder Bomb Studio sustain-green (`d8697bb`); finish email sent (`eaeaf4b8`). Next unused score-2 pick: **Data World Studio** from paper `2607.15901` (DSWorld � predict DS op outcomes before execute; no public code). PM + design pack written; climb next.

## 2026-07-24 � Agent Safety Studio finished; Ladder Bomb Studio started

Agent Safety Studio sustain-green (`96ac164`); finish email sent (`d6ce727e`). Next unused score-3 pick: **Ladder Bomb Studio** from paper `2607.08417` (formal LLB detection / trigger synthesis; no public code). PM + design pack written; idea email sent (`a1f6038b`); climb in flight.

## 2026-07-23 — Papers-driven reset

Removed all product trees except **Filing Penalty Desk**. Wiped historical `docs/ideas/*` kits. Intake is **simple-papers** → pick implementable paper → build same tick. Human email only on validated idea and finished product. Hours / ready-to-build holds retired for paper-sourced work.

**First pick:** **Model Compiler Desk** (`model-compiler-desk`) from paper `2607.15865` (MLIR compilation for LLMs, public code). Smoke green. Idea-validated email sent (`c9728f6e`). Filing Penalty Desk finish re-email hit Resend Unauthorized — retry next tick.

**Skeptical one-liner:** A thinner portfolio only helps if the picker actually refuses non-software papers.

## 2026-07-23 � Model Compiler Desk finished; Graph Retrieval Desk started

Model Compiler Desk sustain GREEN (33 tests, 9 pages, 18 features). Finish letter emailed (plain narrative). Filing Penalty Desk finish letter resent. Next pick: **Graph Retrieval Desk** from paper 2607.11683 (multi-step graph retrieval, public code). Smoke green; idea email sent.

## 2026-07-26 — Focus: good scoring & good rubrics

**Steer:** prioritize **scoring quality** (rubric design, reliability, validity, calibration, bias) over recruiting apps.

**Screen:** same 1,944-paper crawl → **162** method-strong scoring/rubric papers (down-ranked pure resume/hiring apps unless they invent a scoring method).

### What “good scoring” looks like (from the literature)

1. **Analytic, not holistic** — decompose into independently scoreable criteria
2. **Executable / locked rubrics** — versioned criteria, not prompt prose that drifts
3. **Evidence-anchored judgments** — cite observable evidence per criterion
4. **Calibrated scales** — align score boundaries to human raters
5. **Reliability ≠ validity** — agreement alone is not enough; measure what you claim
6. **Selective trust** — escalate when the judge is unsure
7. **Bias hardening** — rubric order, score IDs, position, self-preference, reference answers

### Top 10 — scoring / rubric methods

| # | Paper | What it solves |
| --- | --- | --- |
| 1 | [RULERS — From Rubrics to Reliable Scores](https://arxiv.org/abs/2601.08654) | Compiler for rubrics → executable criteria + evidence checks + scale calibration |
| 2 | [Autorubric](https://arxiv.org/abs/2603.00077) | Unified production recipe: criterion types, ensembles, few-shot calibration, bias mitigations, psychometric metrics |
| 3 | [PReMISE](https://arxiv.org/abs/2605.30803) | Treats rubrics as **measurement specifications** (locks vague “helpful” into scoreable policy) |
| 4 | [Trust or Escalate](https://arxiv.org/abs/2407.18370) | Selective scoring with **provable human-agreement guarantees** + cheap→strong cascade |
| 5 | [Diagnosing LLM-as-a-Judge via IRT](https://arxiv.org/abs/2602.00521) | Psychometrics: is the judge a stable measurement instrument? |
| 6 | [Evaluating Scoring Bias in LLM-as-a-Judge](https://arxiv.org/abs/2506.22316) | Scoring-mode biases (rubric order, score IDs, reference answers) — not just pairwise preference bias |
| 7 | [Reliability without Validity](https://arxiv.org/abs/2606.19544) | Shows exact-match agreement misleads; forces better reliability/validity protocols |
| 8 | [From Holistic Evaluation to Structured Criteria](https://arxiv.org/abs/2606.08625) | Survey map of the field’s shift from scalar scores → structured rubrics |
| 9 | [JudgmentBench](https://arxiv.org/abs/2605.25240) | Head-to-head: **rubric vs preference** evaluation for quality assessment |
| 10 | [RubricEval](https://arxiv.org/abs/2603.25133) | Meta-eval at **criterion level** — did the judge get each rubric item right? |

### Strong adjacent (scoring craft)

- [Prometheus](https://arxiv.org/abs/2310.08491) — open fine-grained rubric judges
- [LLM-Rubric](https://arxiv.org/abs/2501.00274) — multidimensional + calibrated NLP evaluation
- [Am I More Pointwise or Pairwise?](https://arxiv.org/abs/2602.02219) — position bias in rubric judging
- [Rethinking Rubric Generation](https://arxiv.org/abs/2602.05125) — better rubrics improve both judges and rewards
- [Designing Reliable LLM-Assisted Rubric Scoring](https://arxiv.org/abs/2604.12227) — practice pattern for constructed-response scoring

### Product implication (research only)

If we later build a scoring product, the core is a **Rubric Studio**: author → lock/compile → score with evidence → calibrate → audit reliability/validity → escalate when unsure. Domain (hiring, education, clinical) is a skin on that kernel — not the product.

Prior recruiting shortlist remains below for buyer wedges; **method priority is this section**.


## 2026-07-26 — Earlier screen note (recruiting apps; deprioritized)

Initial ask mixed recruiters + adjacent. Full screen stats: **1,944** unique / **686** people-scoring relevant. Recruiting apps (Beyond the Resumé, CoMAI, FAIRE, person–job rankers, hiring fairness surveys) remain useful **buyer wedges**, but the steer is now **scoring/rubric quality** (section above).

### simple-papers handoff

Private `simple-papers` was not writable from this agent. Seeded an import package:

- Digest JSON: `docs/ideas/_paper-picks/digests/2026-07-26.json` (scoring/rubric top 10 + craft adjacent)
- Drop instructions: `docs/ideas/_paper-picks/SIMPLE_PAPERS_HANDOFF.md`
- Picker also reads local handoff digests under `docs/ideas/_paper-picks/digests/`

Theme tag: `good-scoring-rubrics`.
