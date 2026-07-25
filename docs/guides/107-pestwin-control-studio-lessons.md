# Pestwin Control Studio — what we learned

Tutor guide for shipping a soft-sim vector-control bench inspired by PesTwin (arXiv 2607.09420) without claiming field eradication or live spray-fleet write-back.

## Category practices shipped

| Practice | How it shipped |
|----------|----------------|
| Dual compare | `modular_multiagent_pest_control` vs `single_species_baseline` |
| Goldens | ≥30 fixtures `pc-001`…`pc-030` |
| Scoreboard | Ranked multi-agent overall |
| Versioned packs | Control pack registry with agent budgets |
| Honesty fence | `/honesty` + landing footer |
| Platform | Bearer auth, members, audit, export, HMAC webhook, rate limit |

## Deferred

- Live spray-fleet integrations (explicit non-goal)
- Field-validated eradication claims (explicit non-goal)
- Authors' code port (none published)

## Anti-clone lesson

Keep domain nouns (controls, modules, populations, runs). Do not ship `/jobs` `/lifecycle` `/scenario` desk shells.

## Flows that mattered

1. Create control pack  
2. Compose agent modules  
3. Run population simulation  
4. Run A/B compare  
5. Export + webhook  

## Soft-sim honesty

Every commercial surface must say soft-sim only. Pack “lock” means method-lab soft-sim readiness, not operational spray authorization.
