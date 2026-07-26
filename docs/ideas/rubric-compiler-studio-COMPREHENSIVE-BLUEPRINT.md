# Blueprint — Rubric Compiler Studio

## Pages (≥11; NOT desk clone)

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing — sell compiled, evidence-anchored scoring |
| `/pricing` | Hypothetical tiers: Evaluator seats · Platform seats+usage · Site license |
| `/demo` | Guided happy path: pack → lock → run → calibrate → escalate → compare |
| `/onboarding` | First-run checklist with visible progress |
| `/flows` | ≥5 named sophisticated journeys with entry CTAs |
| `/rubrics` | Rubric pack registry (draft → locked) |
| `/criteria` | Executable criteria for a pack |
| `/runs` | Score runs with evidence anchors |
| `/calibration` | Human-reference calibration sets |
| `/escalations` | Selective-trust escalation queue |
| `/compare` | Compiled rubric (A) vs holistic (B) |
| `/scoreboard` | Pack / run leaderboard |
| `/settings` | Org, members, webhook, exports |
| `/honesty` | Soft-sim fence + Sources |

Forbidden primary IA: `/jobs` `/lifecycle` `/scenario` `/batch` `/audit` `/goldens`

## Dual score

| Impl | Meaning |
|------|---------|
| **A** | Compiled rubric: locked criteria + evidence anchors + calibration + escalate-on-low-trust |
| **B** | Holistic baseline: single fluent score, no evidence, no escalate |

## Feature matrix (≥25)

1. Marketing landing  
2. Pricing page with tiers  
3. Guided step-by-step demo  
4. Onboarding checklist with progress  
5. Multi-flow index (≥5 journeys)  
6. Rubric pack create / list / archive  
7. Lock / unlock rubric pack  
8. Criterion create / list / reorder  
9. Criterion search + filter  
10. Score run create / list  
11. Evidence anchor attach per criterion  
12. Calibration set create / list  
13. Apply calibration to run  
14. Escalation create when trust gate fails  
15. Escalation resolve / dismiss  
16. Dual score panel (A vs B)  
17. Compare + winner  
18. Scoreboard aggregates  
19. Honesty fence page  
20. Org settings edit  
21. Member invite / role  
22. Bearer auth on APIs  
23. Rate-limit feedback  
24. Idempotent webhook HMAC  
25. Export packs / compares JSON+CSV  
26. Features inventory API  
27. Goldens sample API  
28. Audit trail  
29. try.html offline demo  
30. In-app guide link  

## Aggregates

RubricPack, Criterion, ScoreRun, EvidenceAnchor, CalibrationSet, Escalation, CompareResult (+ Org/Members/Audits)

## Test themes

- Dual-impl goldens ≥30  
- Store CRUD + compare + webhook idempotency  
- UI critical path per page including `/pricing` `/demo` `/onboarding` `/flows`  
- Live app-up (build + start GET `/`)  
