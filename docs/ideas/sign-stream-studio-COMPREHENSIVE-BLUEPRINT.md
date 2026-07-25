# Blueprint — Sign Stream Studio

## Category
**A11y / language-access** — institution seats + stream minutes; real-time sentence stream vs offline batch.

## Pages (≥11; NOT desk clone; NOT Hold Match / Tactile Chart)

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing — sell real-time sentence stream vs offline batch |
| `/pricing` | Hypothetical tiers: Pilot · Institution · Site license |
| `/demo` | Step-by-step guided happy path (one showcase) |
| `/onboarding` | First-run checklist with visible progress |
| `/flows` | Multi-flow index — ≥5 named journeys with entry CTAs |
| `/streams` | Sign stream registry |
| `/sentences` | Sentence segment workspace |
| `/latency` | Latency / SLA budget board |
| `/glossary` | Glossary coverage editor |
| `/compare` | Real-time stream (A) vs offline-batch (B) |
| `/settings` | Org, members, webhook, exports, audits |
| `/honesty` | Soft-sim fence + keyboard/contrast notes + Sources |

Forbidden primary IA: `/jobs` `/lifecycle` `/scenario` `/batch` `/audit` `/goldens` · no holds/matches · no chart IA

## Named user flows (≥5)

| Flow | Actor | Job | Entry |
|------|-------|-----|-------|
| First-run onboarding | Language-access product lead | Stand up studio | `/onboarding` |
| Create stream → segment → score | Localization engineer | Register stream + cut segment | `/streams` |
| Real-time vs offline-batch compare | A11y program reviewer | Falsify stream vs batch | `/compare` |
| Glossary curator | Terminology curator | Raise vocab coverage | `/glossary` |
| Latency / SLA review | Ops / SLA owner | Set flush + budget honesty | `/latency` |
| Audit + export | Compliance reviewer | Export JSON/CSV + audits | `/settings` |
| Invite / org settings | Org owner | Invite reader + org save | `/settings` |
| Pricing-tier selection | Buyer | Pick Pilot/Institution/Site | `/pricing` |

Each flow documents steps, success, and empty/error on `/flows`.

## Platform must-haves (a11y / language-access)

- Glossary coverage editor
- Latency / SLA budgets + flush policy
- Stream search/filter
- Dual compare (realtime vs offline-batch)
- Org settings + member invite + roles
- Audit trail + JSON/CSV export
- Idempotent webhook + bearer auth + rate limit
- Onboarding checklist + honesty fence
- Keyboard / contrast honesty notes (soft-sim, not WCAG certification)
- Multi-flow index `/flows`

## Dual score

| Impl | Meaning |
|------|---------|
| **A** | Real-time sentence stream quality |
| **B** | Offline-batch baseline |

## Feature matrix (≥25)

1. Marketing landing  
2. Pricing page with tiers  
3. Guided step-by-step demo  
4. Onboarding checklist with progress  
5. Multi-flow index (`/flows`)  
6. Stream create / list / archive  
7. Stream search + filter by language/status  
8. Sentence segment create with boundary confidence  
9. Latency budget create with flush policy  
10. Glossary entry create with coverage  
11. Dual score panel (A vs B)  
12. Real-time vs offline-batch compare + winner  
13. Honesty fence page  
14. Keyboard / contrast honesty notes  
15. Org settings edit  
16. Member invite / role  
17. Bearer auth on APIs  
18. Rate-limit feedback  
19. Idempotent webhook  
20. Export streams JSON  
21. Export compares CSV  
22. Features inventory API  
23. Goldens sample API  
24. Audit trail  
25. In-app guide link  
26. try.html offline demo  
27. Seed demo stream from onboarding  
28. Pagination on list APIs  

## Aggregates

SignStream, SentenceSegment, LatencyBudget, GlossaryEntry, StreamCompare (+ Org/Members/Audits)

## Test themes

- Dual-impl goldens ≥30  
- Store CRUD + compare + webhook idempotency + ≥25 features  
- UI critical path per page including `/pricing` `/demo` `/onboarding` `/flows`  
- Live app-up (build + start GET `/`)  
