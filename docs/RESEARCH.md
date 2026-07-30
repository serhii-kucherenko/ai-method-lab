# Research log

Business-first lab. Papers optional. Software-solvable ideas only (biz-rubric-v2).

## 2026-07-30 — ARS tick: Autorubric folded into Rubric Compiler (not a new climb)

Deepened [Autorubric](https://arxiv.org/abs/2603.00077) via ARS-on-Cursor. Kill rounds reject a second product; treat as recipe input for Rubric Compiler Studio. Artifacts: `docs/ideas/autorubric-method-{RELATED-WORKS,ARS-BRIEF,KILL-ROUNDS}.*`. SER-103.

## 2026-07-30 — ARS-on-Cursor for paper deepening (no Anthropic key)

Wired [Academic Research Skills](https://github.com/Imbad0202/academic-research-skills) into the Researcher path without Claude Code / `ANTHROPIC_API_KEY`:

- Protocol `protocols/ARS_PAPER_RESEARCH.md` · guide `docs/ARS_CURSOR.md`
- Cursor skill `.cursor/skills/ars-lab-paper-research/`
- Scripts: `bootstrap-ars.mjs`, `resolve-ars-root.mjs`, `ars-related-works.mjs` (OpenAlex + arXiv)
- First pass on **Rubric Compiler Studio** / RULERS (`2601.08654`): RELATED-WORKS + ARS-BRIEF + KILL-ROUNDS

Linear: [ai-method-lab](https://linear.app/serhii-kucherenko/project/ai-method-lab-27d1b78be235) · SER-102

**Skeptical one-liner:** Related-works quality depends on query tightness - vague “rubrics” pulls education lit; LLM-judge phrasing recovers the right neighborhood.

## 2026-07-26 — Pivot: business ideas, not devices / healthcare / retail soft-sims

**Human steer:** stop climbing paper soft-sims that software cannot productize (devices, clinical carepaths, wet-lab biologics, retail/consumer novelty). Work on **business ideas software engineering can fix**.

**Actions:**
- Bumped `docs/BUSINESS_RUBRIC.md` → **biz-rubric-v2** (hard fails for non-software + retail novelty)
- Hardened `scripts/pick-paper-idea.mjs` refuse list
- **Killed** Map Anchor Studio mid-climb
- Seeded **Rubric Compiler Studio** (idea-first from scoring queue below)

**Skeptical one-liner:** A rubric studio only wins if the money story is seats+usage for eval leads — not another noun-swapped soft-sim desk.

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

### Product implication

**Rubric Compiler Studio** is the active idea: author → lock/compile → score with evidence → calibrate → audit reliability/validity → escalate when unsure. Domain (hiring, education, support) is a skin — not the product. Clinical/device skins are **out of scope**.

Private `simple-papers` was not writable from this agent. Seeded an import package:

- Digest JSON: `docs/ideas/_paper-picks/digests/2026-07-26.json` (scoring/rubric top 10 + craft adjacent)
- Drop instructions: `docs/ideas/_paper-picks/SIMPLE_PAPERS_HANDOFF.md`
- Picker also reads local handoff digests under `docs/ideas/_paper-picks/digests/`

Theme tag: `good-scoring-rubrics`.
