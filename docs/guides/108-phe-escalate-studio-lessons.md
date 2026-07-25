# Phe Escalate Studio — what we learned

Tutor guide for shipping a soft-sim public-health emergency escalation bench inspired by medRxiv 10.64898/2026.07.07.26357475 without claiming operational MoH authority, live write-back, or clinical diagnosis.

## Category practices shipped

| Practice | How it shipped |
|----------|----------------|
| Dual compare | `ai_assisted_phe_escalation` vs `manual_triage_baseline` |
| Goldens | ≥30 fixtures `pe-001`…`pe-030` |
| Scoreboard | Ranked AI-assisted overall |
| Versioned packs | Escalate pack registry with case budgets |
| Honesty fence | `/honesty` + landing footer |
| Platform | Bearer auth, members, audit, export, HMAC webhook, rate limit |

## Deferred

- Live MoH write-back (explicit non-goal)
- Operational deployment authority claims (explicit non-goal)
- Clinical diagnosis (explicit non-goal)
- Authors' code port (none published)

## Anti-clone lesson

Keep domain nouns (escalates, classifications, thresholds, runs). Do not ship `/jobs` `/lifecycle` `/scenario` desk shells.

## Flows that mattered

1. Create escalate pack  
2. Configure classification rules  
3. Set escalation thresholds  
4. Run A/B compare  
5. Export + webhook  

## Soft-sim honesty

Every commercial surface must say soft-sim only. Pack “lock” means method-lab soft-sim readiness, not operational ministry escalation authorization.
