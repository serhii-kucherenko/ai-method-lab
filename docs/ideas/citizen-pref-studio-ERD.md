# ERD — Citizen Pref Studio

## Aggregates
Org · PolicyPack · RegOption · CountryCohort · SurveyBatch · PrefRun · AuditEvent

## Relationships
Org 1—* PolicyPack 1—* RegOption / CountryCohort  
Pack + SurveyBatch → PrefRun (dual scores)  
Org 1—* AuditEvent  
