# ERD — Rubric Compiler Studio

Organization · Member · RubricPack · Criterion · ScoreRun · EvidenceAnchor · CalibrationSet · Escalation · CompareResult · RecipeTemplate · PolicyLock · JudgeHealthSnapshot · BiasSuiteRun · ValidityAnchor · PreferenceCompare · CriterionJudgeScore · AuditEntry · WebhookDelivery

## Core relations

- Org has many RubricPacks, Members, ScoreRuns
- RubricPack has many Criteria (locked when pack status = locked)
- ScoreRun references RubricPack + produces criterion scores + EvidenceAnchors
- CalibrationSet binds human reference scores to scale boundaries
- Escalation opens when confidence / agreement gate fails
- CompareResult stores path A (compiled) vs path B (holistic) winner
- RecipeTemplate seeds Criterion sets (Autorubric-inspired types / ensembles)
- PolicyLock ledger records who locked a RubricPack against which suite + rollback pointer (PReMISE)
- JudgeHealthSnapshot stores plain-language reliability signals for a pack/run window
- BiasSuiteRun records order / score-ID / reference-answer gate outcomes
- ValidityAnchor ties gold human labels; surfaces agreement≠validity warnings
- PreferenceCompare stores rubric vs preference mode runs (JudgmentBench)
- CriterionJudgeScore stores per-criterion meta-eval of the judge (RubricEval)

## Auth / tenancy

Bearer auth; Member roles scoped to Organization. AuditEntry append-only for lock, escalate, bias, and validity events.
