# Blueprint — Video Track Studio

## Pages (≥11; NOT desk clone; NOT Consult Bench / Attest Proof)

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing — sell character-track diagnosis for long-form Video-LLMs |
| `/pricing` | Hypothetical tiers: Evaluator · Platform · Site license |
| `/demo` | Step-by-step guided happy path (clip → character → probe → failure → compare) |
| `/onboarding` | First-run checklist with visible progress |
| `/clips` | Long-form clip registry |
| `/characters` | Cast character registry bound to clips |
| `/probes` | Track-probe workspace (name-swap / identity sensitivity) |
| `/failures` | Failure diagnosis taxonomy |
| `/compare` | Track-aware (A) vs fluency baseline (B) |
| `/settings` | Org, members, webhook, exports |
| `/honesty` | Soft-sim fence + Sources |

Forbidden primary IA: `/jobs` `/lifecycle` `/scenario` `/batch` `/audit` `/goldens` · no medical consult desks · no attest/kernel/claims shells

## Dual score

| Impl | Meaning |
|------|---------|
| **A** | Track-aware diagnosis quality (identity bind, name sensitivity, temporal coverage) |
| **B** | Benchmark-fluency baseline (option fluency without character tracking) |

## Feature matrix (≥20)

1. Marketing landing  
2. Pricing page with tiers  
3. Guided step-by-step demo  
4. Onboarding checklist with progress  
5. Clip create / list / archive  
6. Clip search + filter by show/status  
7. Character create / list bound to clip  
8. Track probe create (name_swap / gender_swap / open_ended / frame_boost)  
9. Probe sensitivity + identity-bind inputs  
10. Failure diagnosis create / taxonomy  
11. Dual score panel (A vs B)  
12. Track-aware vs fluency compare + winner  
13. Honesty fence page  
14. Org settings edit  
15. Member invite / role  
16. Bearer auth on APIs  
17. Rate-limit feedback  
18. Idempotent webhook  
19. Export clips JSON  
20. Export compares CSV  
21. Features inventory API  
22. Goldens sample API  
23. Audit trail  
24. In-app guide link  
25. try.html offline demo  
26. Seed demo clip/cast from onboarding  

## Aggregates

Clip, Character, TrackProbe, FailureDiagnosis, TrackCompare (+ Org/Members/Audits)

## Test themes

- Dual-impl goldens ≥30  
- Store CRUD + compare + webhook idempotency  
- UI critical path per page including `/pricing` `/demo` `/onboarding`  
- Live app-up (build + start GET `/`)  
