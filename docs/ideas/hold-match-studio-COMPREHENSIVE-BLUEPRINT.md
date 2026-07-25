# Blueprint — Hold Match Studio

## Pages (≥11; NOT desk clone; NOT Video Track / Attest Proof)

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing — sell experience-aware hold vs first-feasible matching |
| `/pricing` | Hypothetical tiers: Ops · Marketplace · Site license |
| `/demo` | Step-by-step guided happy path (match → hold → lanes → timeline → compare) |
| `/onboarding` | First-run checklist with visible progress |
| `/matches` | Driver–order candidate registry |
| `/holds` | Hold decision board (tiers + budgets) |
| `/lanes` | Passenger / driver experience lanes |
| `/timelines` | Match hold/release timeline workspace |
| `/compare` | Experience-aware (A) vs first-feasible (B) |
| `/settings` | Org, members, webhook, exports |
| `/honesty` | Soft-sim fence + Sources |

Forbidden primary IA: `/jobs` `/lifecycle` `/scenario` `/batch` `/audit` `/goldens` · no clips/probes · no attest/kernel/claims shells

## Dual score

| Impl | Meaning |
|------|---------|
| **A** | Experience-aware hold quality (tier fitness, cancel risk reduction, guardrail respect) |
| **B** | First-feasible baseline (immediate lock without experience hold) |

## Feature matrix (≥20)

1. Marketing landing  
2. Pricing page with tiers  
3. Guided step-by-step demo  
4. Onboarding checklist with progress  
5. Match candidate create / list / archive  
6. Match search + filter by zone/status  
7. Hold decision create with experience tiers  
8. Hold budget + risk inputs  
9. Passenger experience lane  
10. Driver experience lane  
11. Match timeline events  
12. Dual score panel (A vs B)  
13. Experience-aware vs first-feasible compare + winner  
14. Honesty fence page  
15. Org settings edit  
16. Member invite / role  
17. Bearer auth on APIs  
18. Rate-limit feedback  
19. Idempotent webhook  
20. Export matches JSON  
21. Export compares CSV  
22. Features inventory API  
23. Goldens sample API  
24. Audit trail  
25. In-app guide link  
26. try.html offline demo  
27. Seed demo match/hold from onboarding  

## Aggregates

MatchCandidate, HoldDecision, ExperienceLane, MatchTimeline, HoldCompare (+ Org/Members/Audits)

## Test themes

- Dual-impl goldens ≥30  
- Store CRUD + compare + webhook idempotency  
- UI critical path per page including `/pricing` `/demo` `/onboarding`  
- Live app-up (build + start GET `/`)  
