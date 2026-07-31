# Blueprint — Webhook Retry Debt Studio

## Pages (≥11)
| Route | Purpose |
|-------|---------|
| `/` | Marketing — sell delivery debt queue before review |
| `/pricing` | Org seats + debt-sync usage tiers |
| `/demo` | Import → classify debt → cleanup pack |
| `/onboarding` | First-run checklist |
| `/flows` | ≥5 journeys (import, debt triage, review pack, compare, export) |
| `/destinations` | Outbound destinations + owners |
| `/deliveries` | Delivery attempt inventory |
| `/debt` | Failed / pending / DLQ findings |
| `/reviews` | Incident reviews + cleanup cases |
| `/imports` | Delivery sync batches |
| `/compare` | A debt-aware vs B ignore-backlog |
| `/scoreboard` | Destination / debt leaderboard |
| `/settings` | Org, members, webhooks, export |
| `/honesty` | Soft-sim fence + Sources |

Forbidden primary IA: `/jobs` `/lifecycle` `/scenario` `/batch` `/audit` `/goldens`

## Dual score
| Impl | Meaning |
|------|---------|
| **A** | Debt-aware: classify failed/pending by age → cleanup queue + blast radius |
| **B** | Ignore-backlog: treat deliveries as fine until pager fires |

## Feature matrix (≥25)
1–5 Landing, pricing, demo, onboarding, flows  
6–10 Destination CRUD, owner lock, search, severity tag, archive  
11–15 Delivery import, debt classify, review case, compare A/B, evidence export  
16–20 Scoreboard, honesty, org settings, members, bearer auth  
21–25 Rate-limit feedback, webhook HMAC, export JSON/CSV, features API, goldens API  
26–28 Audit trail, try.html, in-app guide  

## Aggregates
Destination, DeliveryAttempt, DebtFinding, IncidentReview, CleanupCase, CompareResult (+ Org/Members/Audits)
