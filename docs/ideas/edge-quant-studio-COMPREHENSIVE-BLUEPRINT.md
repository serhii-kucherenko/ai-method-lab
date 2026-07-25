# Blueprint — Edge Quant Studio

## Pages (NOT desk clone; NOT Legacy Infer / Prompt Cache / Model Compile copy)

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing — sell channel-aware edge CPU quant planning |
| `/packs` | Model pack registry |
| `/channels` | Channel bit-width plan board |
| `/targets` | Edge CPU target profiles |
| `/runtime` | Compile / runtime soft-sim plans |
| `/budgets` | Latency / memory honesty budgets |
| `/compare` | Channel-aware vs uniform bit-width |
| `/settings` | Org, members, webhook |
| `/honesty` | Soft-sim fence + Sources |

Forbidden primary IA: `/jobs` `/lifecycle` `/scenario` `/batch` `/audit` `/goldens`

## Dual score

| Impl | Meaning |
|------|---------|
| **A** | Channel-aware plan quality (activation-saliency waterfill under fractional avg-bit budget + cluster/layout regularity) |
| **B** | Naive uniform bit-width baseline (single operating point; ignores channel saliency) |

## Feature matrix (≥20)

1. Marketing landing  
2. Model pack create/list/archive  
3. Pack search + filter by status  
4. Edge target create/list  
5. Target CPU class tagging  
6. Channel plan create with avg-bit budget  
7. Channel plan list + status advance  
8. Dual score panel (A vs B)  
9. Compare create + winner  
10. Runtime plan soft-sim  
11. Memory/latency budget board  
12. Honesty fence page  
13. Org settings edit  
14. Member invite / role  
15. Bearer auth on APIs  
16. Rate-limit feedback  
17. Idempotent webhook  
18. Export plans JSON  
19. Export compares CSV  
20. Features inventory API  
21. Goldens sample API  
22. Audit trail (API + settings surface)  
23. Onboarding checklist on packs empty state  
24. In-app guide link  
25. try.html offline demo  

## Aggregates

ModelPack, EdgeTarget, ChannelPlan, RuntimePlan, MemoryBudget, CompareResult (+ Org/Members/Audits)

## Test themes

- Dual-impl goldens ≥30  
- Store CRUD + compare + webhook idempotency  
- UI critical path per page  
- Live app-up (build + start GET `/`)
