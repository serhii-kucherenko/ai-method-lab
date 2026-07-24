# PRODUCT — Realtime Deploy Studio

## Buyer
Platform / MLOps teams shipping realtime multimodal apps who need an agent harness to guide deploy optimizations — not one-shot guesswork.

## Outcome
Apps → harnessed deploy plans (IR / validate / transform / measure) → readiness gates → harnessed vs naive compare → auditable export.

## Pages
`/` `/apps` `/deploy` `/readiness` `/compare` `/runs` `/settings` `/honesty`

## Features (≥20)
1. Marketing landing with selling points
2. Deploy app / environment create
3. App search (environment / modalities)
4. Harnessed deploy console
5. Naive single-shot baseline mode
6. Full vs fast deploy profile
7. IR / validate / transform / measure stage advance
8. Latency readiness checks
9. Throughput readiness checks
10. Multimodal sync readiness
11. Correctness gate readiness
12. Readiness upsert from console
13. Harnessed vs naive compare
14. Compare winner badge + score bars
15. Runs audit list
16. CSV audit export
17. JSON run export
18. Org settings
19. Member invite
20. Webhook HMAC + idempotent ingest
21. Bearer auth + rate limit
22. Honesty fence + Sources
23. Onboarding checklist on apps
24. Dual-impl goldens sample API
25. Pagination on apps / runs / audits
26. TTFO + harness lift metrics
27. Soft simulation disclaimer (not FlashRT brand)

## Aggregates
Organization · DeployApp · DeployRun · ReadinessCheck · AuditEntry (+ CompareResult)

## Forbidden IA
Do not ship `/jobs` `/lifecycle` `/scenario` `/batch` `/goldens` as primary routes.
