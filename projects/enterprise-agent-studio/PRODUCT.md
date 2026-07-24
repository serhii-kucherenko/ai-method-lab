# PRODUCT — Enterprise Agent Studio

## Buyer
Enterprise platform teams exploring multi-agent LLM architectures for autonomous resource planning who need role orchestration and evaluation — not a single unchecked chat agent.

## Outcome
Domains → role agents → resource plans (intake / allocate / reconcile / review) → multi vs single compare → auditable export.

## Pages
`/` `/domains` `/agents` `/plans` `/compare` `/runs` `/settings` `/honesty`

## Features (≥20)
1. Marketing landing with selling points
2. ERP domain workspace create
3. Domain search (kind / notes)
4. Role agent roster
5. Agent orchestration toggle
6. Resource plan console
7. Multi-agent orchestrated mode
8. Single-agent unchecked baseline
9. Balanced vs aggressive plan profile
10. Intake / allocate / reconcile / review stage advance
11. Constraint count editor on plans
12. Role coverage from active agents
13. Multi vs single compare
14. Compare winner badge + score bars
15. Runs audit list
16. CSV audit export
17. JSON plan-run export
18. Org settings
19. Member invite
20. Webhook HMAC + idempotent ingest
21. Bearer auth + rate limit
22. Honesty fence + Sources
23. Onboarding checklist on domains
24. Dual-impl goldens sample API
25. Pagination on domains / runs / audits
26. Coordination lift + allocation fit metrics
27. Soft simulation disclaimer (not Agentic ERP brand)

## Aggregates
Organization · ErpDomain · AgentRole · ResourcePlan (PlanRun) · AuditEntry (+ CompareResult)

## Forbidden IA
Do not ship `/jobs` `/lifecycle` `/scenario` `/batch` `/goldens` as primary routes.
