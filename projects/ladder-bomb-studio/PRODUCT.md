# PRODUCT — Ladder Bomb Studio

## Buyer
OT / ICS security engineers who must find ladder logic bombs in IEC 61131-3 PLC programs before actuators or operator control can be abused.

## Outcome
Plants → ladder programs → FB-aware formal scans → trigger synthesis → findings taxonomy → dropped-FB compare → auditable export.

## Pages
`/` `/plants` `/programs` `/scans` `/triggers` `/findings` `/compare` `/settings` `/honesty`

## Features (≥20)
1. Marketing landing with OT buyer outcome
2. Plant / site registry
3. Plant search by site code and criticality
4. IEC 61131-3 ladder program library
5. Program import notes and dialect tags
6. Formal verification scan runs
7. FB-aware formal plan score
8. Dropped-FB baseline score
9. Balanced vs strict scan profile
10. Trigger synthesis for findings
11. Findings console with bomb taxonomy
12. Finding triage / resolve advance
13. FB-aware vs dropped-FB compare
14. Compare winner badge + score bars
15. Audit history list
16. CSV audit export
17. JSON findings export
18. Org settings
19. Member invite
20. Webhook HMAC + idempotent ingest
21. Bearer auth + rate limit
22. Honesty fence + Sources
23. Onboarding checklist on plants
24. Dual-impl goldens sample API
25. Pagination on plants / scans / audits
26. Bomb catch rate + trigger recovery metrics
27. Soft simulation disclaimer (not ESBMC-LLB brand)

## Aggregates
Organization · Plant · LadderProgram · VerifyScan · TriggerSynth · BombFinding · AuditEntry (+ CompareResult)

## Forbidden IA
Do not ship `/jobs` `/lifecycle` `/scenario` `/batch` `/goldens` as primary routes.
Do not noun-swap fleets/monitors/alerts from Agent Safety Studio.
