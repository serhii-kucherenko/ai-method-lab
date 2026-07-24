# PRODUCT — Model Compile Studio

## Buyer
ML systems engineers compiling large language models toward efficient accelerator targets who need a multi-pass MLIR-style plan — not a one-shot opaque export.

## Outcome
Models → multi-pass compile → targets → artifact inspection → multi-pass vs single-pass compare → auditable export.

## Pages
`/` `/models` `/compile` `/targets` `/artifacts` `/compare` `/runs` `/settings` `/honesty`

## Features (≥20)
1. Marketing landing with selling points
2. Model project create
3. Model search (family / scale / tags)
4. Multi-pass compile console
5. Single-pass / target-blind baseline mode
6. Full vs fast compile profile
7. Pass budget + IR depth inputs
8. Stage advance (queued → complete)
9. Target profile create
10. Artifact browser with kind filter
11. Pass timeline / contribution bars
12. Multi-pass vs single-pass compare
13. Compare winner badge + score bars
14. Runs audit list
15. CSV audit export
16. JSON run export
17. Org settings
18. Member invite
19. Webhook HMAC + idempotent ingest
20. Bearer auth + rate limit
21. Honesty fence + Sources
22. Onboarding checklist on models
23. Dual-impl goldens sample API
24. Pagination on models / runs / audits
25. Predicted artifact tier (mlir / optimized_ir / binary)
26. Soft simulation disclaimer (no chip timing claims)

## Aggregates
Organization · ModelProject · CompileRun · Artifact · AuditEntry (+ TargetProfile, CompareResult)

## Forbidden IA
Do not ship `/jobs` `/lifecycle` `/scenario` `/batch` `/goldens` as primary routes.
