# Blueprint — Canary Budget Studio

## Pages (≥11)
| Route | Purpose |
|-------|---------|
| `/` | Marketing — sell remaining budget before promote |
| `/pricing` | Org seats + canary-window sync tiers |
| `/demo` | Import → budget → promote/hold pack |
| `/onboarding` | First-run checklist |
| `/flows` | ≥5 journeys (import, budget triage, decision pack, compare, export) |
| `/rollouts` | Canary rollout inventory |
| `/budgets` | Error budget remaining |
| `/signals` | SLO / error / latency signals |
| `/decisions` | Promote / hold / rollback cases |
| `/imports` | Metrics sync batches |
| `/compare` | A budget-aware vs B ship-anyway |
| `/scoreboard` | Service / burn leaderboard |
| `/settings` | Org, members, webhooks, export |
| `/honesty` | Soft-sim fence + Sources |

Forbidden primary IA: `/jobs` `/lifecycle` `/scenario` `/batch` `/audit` `/goldens`

## Dual score
| Impl | Meaning |
|------|---------|
| **A** | Budget-aware: remaining canary error budget → promote/hold + blast radius |
| **B** | Ship-anyway: ignore budget; promote on schedule only |

## Feature matrix (≥25)
1–5 Landing, pricing, demo, onboarding, flows  
6–10 Rollout CRUD, window lock, search, service tag, archive  
11–15 Signal import, budget compute, decision case, compare A/B, evidence export  
16–20 Scoreboard, honesty, org settings, members, bearer auth  
21–25 Rate-limit feedback, webhook HMAC, export JSON/CSV, features API, goldens API  
26–28 Audit trail, try.html, in-app guide  

## Aggregates
Service, CanaryRollout, ErrorBudget, SignalSlice, PromoteDecision, CompareResult (+ Org/Members/Audits)
