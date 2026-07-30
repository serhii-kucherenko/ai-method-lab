# Rubric Compiler Studio — module map (from ARS Top 10)

Research-only synthesis. No new product climbs. Sources: `docs/ideas/*-{ARS-BRIEF,KILL-ROUNDS}.md` + RELATED-WORKS JSONs. SER-103.

## Product spine

**Rubric Compiler Studio** remains the single climb target for scoring/rubric work.

## Modules (paper → surface)

| # | Paper | Module | Ship as |
|---|-------|--------|---------|
| 1 | RULERS `2601.08654` | Criteria compiler + evidence + calibration | Core engine |
| 2 | Autorubric `2603.00077` | Production recipe (types, ensembles, bias pack) | Recipe UI / templates |
| 3 | PReMISE `2605.30803` | Measurement spec / policy lock | Versioned policy artifacts |
| 4 | Trust or Escalate `2407.18370` | Selective trust / escalate queues | Ops queue + SLA |
| 5 | IRT diagnosis `2602.00521` | Judge Health diagnostics | Reliability dashboard |
| 6 | Scoring bias `2506.22316` | Bias Hardening gates | CI / suite checks |
| 7 | Reliability without Validity `2606.19544` | Validity Suite | Gold anchors + warnings |
| 8 | Holistic→structured `2606.08625` | Narrative / onboarding | Landing + docs only |
| 9 | JudgmentBench `2605.25240` | Mode Compare (rubric vs preference) | Compare runs |
| 10 | RubricEval `2603.25133` | Criterion Meta-Eval | Per-criterion judge accuracy |

## Explicit non-goals

- No second/third scoring studios from these papers
- No clinical, education-grading, or RLVR infra pivots
- Hourly ARS loop after Top 10: upgrade Rubric Compiler pack from this map, or deepen non-isomorphic A/B ideas only

## Next engineering/docs work (when climb resumes)

1. Merge modules into `rubric-compiler-studio-COMPREHENSIVE-BLUEPRINT.md` / ROADMAP
2. Re-score under biz-rubric-v2 before arming `projects/`
3. Keep ARS briefs as Sources for finish email / design honesty
