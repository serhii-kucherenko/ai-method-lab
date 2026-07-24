# PRODUCT — Agent Safety Studio

## Buyer
Platform teams deploying AI agents who need structural monitoring for security regressions — not hope-and-check after incidents.

## Outcome
Fleets → structural monitors → regression alerts → structural vs threshold compare → auditable export.

## Pages
`/` `/fleets` `/monitors` `/alerts` `/compare` `/runs` `/settings` `/honesty`

## Features (≥20)
1. Marketing landing with selling points
2. Agent deployment fleet workspace
3. Fleet search (kind / notes)
4. Structural monitor roster
5. Monitor active toggle
6. Sync vs async deploy mode
7. Regression alert console
8. Structural monitoring plan score
9. Unchecked / threshold-only baseline
10. Balanced vs strict monitor profile
11. Alert ack / resolve advance
12. CFG / DFG / privilege check kinds
13. Monitor coverage from active checks
14. Structural vs threshold compare
15. Compare winner badge + score bars
16. Runs audit list
17. CSV audit export
18. JSON alert export
19. Org settings
20. Member invite
21. Webhook HMAC + idempotent ingest
22. Bearer auth + rate limit
23. Honesty fence + Sources
24. Onboarding checklist on fleets
25. Dual-impl goldens sample API
26. Pagination on fleets / runs / audits
27. Catch rate + sync block metrics
28. Soft simulation disclaimer (not IFG brand)

## Aggregates
Organization · AgentFleet · SafetyMonitor · AlertEvent · AuditEntry (+ CompareResult)

## Forbidden IA
Do not ship `/jobs` `/lifecycle` `/scenario` `/batch` `/goldens` as primary routes.
