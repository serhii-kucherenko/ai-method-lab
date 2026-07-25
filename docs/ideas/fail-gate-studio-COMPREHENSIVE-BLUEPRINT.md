# Blueprint — Fail Gate Studio

## Category
**Eval / safety release-gate bench** — bench seats + private fail-case packs; fail-gate taxonomy diagnosis vs correctness-only baseline.

## Pages (≥11; NOT desk clone; NOT Consult Bench consult-turn)

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing — sell release-gate taxonomy over accuracy theater |
| `/pricing` | Hypothetical tiers: Bench · Team · Pack license |
| `/demo` | Step-by-step guided happy path (one showcase) |
| `/onboarding` | First-run checklist with visible progress |
| `/flows` | Multi-flow index — ≥5 named journeys with entry CTAs |
| `/cases` | Fail-case registry |
| `/gates` | Severity + safety-gate taxonomy board |
| `/boundaries` | Boundary inspection workspace |
| `/compare` | Fail-gate (A) vs correctness-only (B) |
| `/scoreboard` | Leaderboard / scoreboard of compares |
| `/packs` | Private fail-case packs |
| `/settings` | Org, members, webhook, exports, audits, search |
| `/honesty` | Soft-sim fence + Sources |

Forbidden primary IA: `/jobs` `/lifecycle` `/scenario` `/batch` `/goldens` · no consult-turn chat desk

## Named user flows (≥5)

| Flow | Actor | Job | Entry |
|------|-------|-----|-------|
| First-run onboarding | Safety QA lead | Stand up studio + ack honesty | `/onboarding` |
| Case → gate → boundary → score | Eval engineer | Register fail case through dual score | `/cases` |
| Fail-gate vs correctness compare | Release reviewer | Falsify accuracy-only greenlight | `/compare` |
| Taxonomy + boundary review | Safety taxonomist | Tune gate type + boundary fit | `/gates` |
| Audit + export | Compliance reviewer | Export JSON/CSV + audits | `/settings` |
| Pack + scoreboard | Bench admin | Version pack + rank compares | `/packs` |
| Pricing-tier selection | Buyer | Pick Bench/Team/Pack | `/pricing` |

Each flow documents steps, success, and empty/error on `/flows`.

## Platform must-haves (eval / bench)

- Goldens sample API + dual-impl harness
- Dual compare (fail-gate vs correctness-only)
- Scoreboard / leaderboard
- Versioned private case packs
- Fail-case search/filter
- Org settings + member invite + roles
- Audit trail + JSON/CSV export
- Idempotent webhook + bearer auth + rate limit
- Onboarding checklist + soft-sim honesty
- Multi-flow index `/flows`

## Dual score

| Impl | Meaning |
|------|---------|
| **A** | Fail-gate taxonomy diagnosis (severity + gate type + boundary reason) |
| **B** | Correctness-only / naive accuracy baseline |

## Feature matrix (≥25)

1. Marketing landing  
2. Pricing page with tiers  
3. Guided step-by-step demo  
4. Onboarding checklist with progress  
5. Multi-flow index (`/flows`)  
6. Fail-case create / list / archive  
7. Case search/filter by specialty/status  
8. Gate taxonomy create (gate type + severity band)  
9. Boundary inspection create (fit + evidence + coherence)  
10. Dual score panel (A vs B)  
11. Fail-gate vs correctness compare + winner  
12. Scoreboard / leaderboard  
13. Case pack create / version / list  
14. Honesty fence page  
15. Soft-sim / not-clinical honesty notes  
16. Org settings edit  
17. Member invite / role  
18. Bearer auth on APIs  
19. Rate-limit feedback  
20. Idempotent webhook  
21. Export cases JSON  
22. Export compares CSV  
23. Features inventory API  
24. Goldens sample API  
25. Audit trail  
26. In-app guide link  
27. try.html offline demo  
28. Seed demo case from onboarding  
29. Pagination on list APIs  
30. Boundary inspection status board  

## Aggregates

FailCase, GateTaxonomy, BoundaryInspection, FailCompare, CasePack (+ Org/Members/Audits)

## Test themes

- Dual-impl goldens ≥30  
- Store CRUD + compare + webhook idempotency + ≥25 features  
- UI critical path per page including `/pricing` `/demo` `/onboarding` `/flows`  
- Live app-up (build + start GET `/`)  
