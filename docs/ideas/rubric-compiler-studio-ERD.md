# ERD — Rubric Compiler Studio

Organization · Member · RubricPack · Criterion · ScoreRun · EvidenceAnchor · CalibrationSet · Escalation · CompareResult · AuditEntry · WebhookDelivery

## Core relations

- Org has many RubricPacks, Members, ScoreRuns
- RubricPack has many Criteria (locked when pack status = locked)
- ScoreRun references RubricPack + produces criterion scores + EvidenceAnchors
- CalibrationSet binds human reference scores to scale boundaries
- Escalation opens when confidence / agreement gate fails
- CompareResult stores path A (compiled) vs path B (holistic) winner
