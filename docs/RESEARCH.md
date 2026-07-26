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


## 2026-07-26 — People / recruiter scoring papers (frontier screen)

**Ask:** best ways to score people (recruiters + adjacent domains); rubrics / reliability / fairness.

**Method:** 25 arXiv relevance queries × up to 100 hits each → **1,944 unique** papers; heuristic screen → **686** people-scoring / rubric / ranking-calibration relevant; diversified shortlist → deep read of top candidates + classics (Prometheus, MT-Bench/Chatbot Arena, hiring-fairness surveys).

**Domain mix in the 686:** LLM-judge/rubric ~149 · ranking/calibration ~190 · education/AES ~100 · recruiting/hiring ~99 · peer-review eval ~45 · HR performance ~19 · fairness-on-people ~15 · clinical skills ~7 (papers can multi-tag).

### Top 10 (most promising to *solve* scoring / rubric problems)

Ranked for transferability into a real scoring product (recruiting first, then general people-scoring), not citation vanity.

| # | Paper | Why it matters | Domain |
| --- | --- | --- | --- |
| 1 | [From Rubrics to Reliable Scores (RULERS)](https://arxiv.org/abs/2601.08654) | Compiles natural-language rubrics into **executable, versioned** criteria + evidence checks + scale calibration. Closest thing to a scoring *engine*, not a prompt. Code: LabRAI/Rulers. | Cross-domain (essays → any analytic rubric) |
| 2 | [Beyond the Resumé](https://arxiv.org/abs/2603.01775) | Recruiter-native: multi-turn interview that **updates calibrated belief over rubric KSAs** instead of one-shot resume scores. Public code + demo. | Recruiting / interviews |
| 3 | [Trust or Escalate](https://arxiv.org/abs/2407.18370) | Selective judging with **provable human-agreement guarantees** + cheap→strong cascade. The missing reliability layer when scores affect people. | Any high-stakes scoring |
| 4 | [CoMAI](https://arxiv.org/abs/2603.16215) | Multi-agent interview stack (question / security / **rubric scoring** / summary) beats monolithic LLM judges; admissions-validated pattern ports to hiring. | Recruiting / admissions |
| 5 | [Autorubric](https://arxiv.org/abs/2603.00077) | Unifies scattered rubric-judge tricks (ensembles, bias fixes, few-shot calibration) into one implementable framework. | Platform / LLM judges |
| 6 | [Diagnosing LLM-as-a-Judge via IRT](https://arxiv.org/abs/2602.00521) | Treats the judge as a **measurement instrument** (Item Response Theory)—needed before trusting people-scores as “ability.” | Education → any trait scoring |
| 7 | [Evaluating Scoring Bias in LLM-as-a-Judge](https://arxiv.org/abs/2506.22316) | Scoring-specific biases (rubric order, score IDs, reference answers)—the failure modes that break recruiter scorecards. | LLM judges / HR scorecards |
| 8 | [Long-Context Ranking + Calibrated Distillation for Person–Job Fit](https://arxiv.org/abs/2601.10321) | Production-shaped **resume↔job re-ranker** with calibration for long multilingual CVs—screening at scale, not chat demos. | Recruiting / matching |
| 9 | [Fairness in AI-Driven Recruitment](https://arxiv.org/abs/2405.19699) | End-to-end map of bias sources, metrics, and mitigations across sourcing→selection. Operating manual for “score people fairly.” | Recruiting fairness |
| 10 | [FAIRE](https://arxiv.org/abs/2504.01420) | Concrete **resume-evaluation fairness benchmark** (race/gender) + code—audit harness for any LLM resume scorer. | Recruiting audit |

### Honorable mentions (also strong)

- [Prometheus](https://arxiv.org/abs/2310.08491) — open fine-grained rubric judges (still a foundational pattern).
- [Judging LLM-as-a-Judge / MT-Bench + Arena](https://arxiv.org/abs/2306.05685) — preference-eval baseline everyone still compares to.
- [A Survey on LLM-as-a-Judge](https://arxiv.org/abs/2411.15594) — taxonomy of judge methods / failure modes.
- [Fairness and Bias in Algorithmic Hiring (multidisciplinary survey)](https://arxiv.org/abs/2309.13933) — broader than ML-only fairness.
- [PReMISE](https://arxiv.org/abs/2605.30803) — policy rubrics as **measurement specs** (locks vague “helpful” into scoreable criteria).

### Skeptical takeaway

Most “hiring AI” papers still do resume similarity. The **solvable** stack is: executable rubrics (1) + belief/elicitation interviews (2,4) + selective human escalation (3) + psychometric + scoring-bias guards (6,7) + calibrated rankers + fairness audits (8–10). Do **not** ship a single LLM holistic score as a person score.

**Next (research only):** keep this shortlist out of product climb until Immunize Impact Studio finishes; if a scoring product is picked later, start from RULERS + Beyond-the-Resumé + Trust-or-Escalate, not another desk clone.
