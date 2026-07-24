# PRODUCT — Rhythm Read Studio

## Buyer
ECG ML teams dealing with long-tailed arrhythmia classes who need contrastive + adaptive label handling — not flat cross-entropy that ignores rare rhythms.

## Outcome
Cohorts → long-tail train/eval → class balance → angular SCL-style vs flat CE compare → auditable export.

## Pages
`/` `/cohorts` `/train` `/classes` `/compare` `/runs` `/settings` `/honesty`

## Features (≥20)
1. Marketing landing with selling points
2. ECG cohort create
3. Cohort search (source / tags)
4. Long-tail-aware train/eval console
5. Flat CE / no-tail baseline mode
6. Full vs fast train profile
7. Angular covariance + adaptive logit inputs
8. Stage advance (queued → complete)
9. Class balance / rare rhythm browser
10. Tail class upsert
11. Class prevalence bars
12. Angular SCL vs flat CE compare
13. Compare winner badge + score bars
14. Runs audit list
15. CSV audit export
16. JSON run export
17. Org settings
18. Member invite
19. Webhook HMAC + idempotent ingest
20. Bearer auth + rate limit
21. Honesty fence + Sources
22. Onboarding checklist on cohorts
23. Dual-impl goldens sample API
24. Pagination on cohorts / runs / audits
25. Tail lift + rare sensitivity metrics
26. Soft simulation disclaimer (no clinical device claims)

## Aggregates
Organization · EcgCohort · TrainEvalRun · ClassStat · AuditEntry (+ CompareResult)

## Forbidden IA
Do not ship `/jobs` `/lifecycle` `/scenario` `/batch` `/goldens` as primary routes.
