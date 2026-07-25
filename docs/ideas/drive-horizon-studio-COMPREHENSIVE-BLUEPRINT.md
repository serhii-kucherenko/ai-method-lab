# Blueprint — Drive Horizon Studio

## Category
**Industrial AV simulation / world-model eval bench** — bench seats + scenario packs; hierarchical coarse+detail vs flat naive rollout.

## Pages (≥11; NOT desk clone)

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing — sell hierarchical horizon trust over flat rollout theater |
| `/pricing` | Hypothetical tiers: Bench · Team · Scenario pack license |
| `/demo` | Step-by-step guided happy path (one showcase) |
| `/onboarding` | First-run checklist with visible progress |
| `/flows` | Multi-flow index — ≥5 named journeys with entry CTAs |
| `/packs` | Versioned scenario pack registry |
| `/scenes` | Coarse scene structure board |
| `/generators` | Detail-generator workspace |
| `/compare` | Hierarchical (A) vs flat (B) world-model compare |
| `/scoreboard` | Leaderboard of compares |
| `/settings` | Org, members, webhook, exports, audits, search |
| `/honesty` | Soft-sim fence + Sources |

Forbidden primary IA: `/jobs` `/lifecycle` `/scenario` `/batch` `/goldens` · never brand Orbis

## Named user flows (≥5)

| Flow | Actor | Job | Entry |
|------|-------|-----|-------|
| First-run onboarding | Sim eval lead | Stand up studio + ack honesty | `/onboarding` |
| Pack → scene → generator → score | World-model engineer | Register horizon through dual score | `/packs` |
| Hierarchical vs flat compare | Planner pack reviewer | Falsify flat-rollout greenlight | `/compare` |
| Coarse + detail review | Scene taxonomist | Tune structure + detail fidelity | `/scenes` |
| Audit + export | Compliance reviewer | Export JSON/CSV + audits | `/settings` |
| Pack version + scoreboard | Bench admin | Version pack + rank compares | `/scoreboard` |
| Pricing-tier selection | Buyer | Pick Bench/Team/Pack | `/pricing` |

Each flow documents steps, success, and empty/error on `/flows`.

## Platform must-haves (industrial-sim / eval)

- Goldens sample API + dual-impl harness
- Dual compare (hierarchical vs flat)
- Scoreboard / leaderboard
- Versioned scenario packs
- Scene / generator search-filter
- Org settings + member invite + roles
- Audit trail + JSON/CSV export
- Idempotent webhook + bearer auth + rate limit
- Onboarding checklist + soft-sim honesty
- Multi-flow index `/flows`

## Dual score

| Impl | Meaning |
|------|---------|
| **A** | Hierarchical world model (coarse scene structure + detail generator) |
| **B** | Flat single-level world-model / naive rollout baseline |

## Feature matrix (≥25)

1. Marketing landing  
2. Pricing page with tiers  
3. Guided step-by-step demo  
4. Onboarding checklist with progress  
5. Multi-flow index (`/flows`)  
6. Scenario pack create / version / list  
7. Pack search/filter by corridor/status  
8. Coarse scene create (structure + horizon steps)  
9. Detail generator create (fidelity + temporal + texture)  
10. Dual score panel (A vs B)  
11. Hierarchical vs flat compare + winner  
12. Scoreboard / leaderboard  
13. Honesty fence page  
14. Soft-sim / not-deployment honesty notes  
15. Org settings edit  
16. Member invite / role  
17. Bearer auth on APIs  
18. Rate-limit feedback  
19. Idempotent webhook  
20. Export scenes JSON  
21. Export compares CSV  
22. Features inventory API  
23. Goldens sample API  
24. Audit trail  
25. In-app guide link  
26. try.html offline demo  
27. Seed demo scene from onboarding  
28. Pagination on list APIs  
29. Scene structure status board  
30. Generator fidelity board  

## Aggregates

ScenarioPack, CoarseScene, DetailGenerator, HorizonCompare (+ Org/Members/Audits)

## Test themes

- Dual-impl goldens ≥30  
- Store CRUD + compare + webhook idempotency + ≥25 features  
- UI critical path per page including `/pricing` `/demo` `/onboarding` `/flows`  
- Live app-up (build + start GET `/`)  
