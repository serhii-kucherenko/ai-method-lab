# PRODUCT — Pathology Slide Studio

## Buyer
Computational pathology teams adopting a foundation backbone who need vision, vision-language, and slide-level signals in one workflow — not patch-vision alone.

## Outcome
Cohorts → multi-signal embed/eval → slide/patch inspection → multi-signal vs vision-only compare → auditable export.

## Pages
`/` `/cohorts` `/embed` `/slides` `/compare` `/runs` `/settings` `/honesty`

## Features (≥20)
1. Marketing landing with selling points
2. Slide cohort create
3. Cohort search (organ / stain / tags)
4. Multi-signal embed console
5. Vision-only baseline mode
6. Full vs fast profile
7. Vision / language / slide signal inputs
8. Stage advance (queued → complete)
9. Slide / patch inspection
10. Signal contribution bars
11. Multi-signal vs vision-only compare
12. Compare winner badge + score bars
13. Runs audit list
14. CSV audit export
15. JSON run export
16. Org settings
17. Member invite
18. Webhook HMAC + idempotent ingest
19. Bearer auth + rate limit
20. Honesty fence + Sources
21. Onboarding checklist on cohorts
22. Dual-impl goldens sample API
23. Pagination on cohorts / runs / audits
24. Slide asset create with magnification
25. Task-fit prediction (roi / multimodal / wsi)

## Aggregates
Organization · SlideCohort · EvalRun · SlideAsset · AuditEntry (+ CompareResult)

## Forbidden IA
Do not ship `/jobs` `/lifecycle` `/scenario` `/batch` `/goldens` as primary routes.
