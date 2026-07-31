# Blueprint — Stale Flag Studio

## Pages (≥11)
| Route | Purpose |
|-------|---------|
| `/` | Marketing — sell flag debt queue before freeze |
| `/pricing` | Org seats + inventory-sync usage tiers |
| `/demo` | Import → classify debt → cleanup pack |
| `/onboarding` | First-run checklist |
| `/flows` | ≥5 journeys (import, debt triage, freeze pack, compare, export) |
| `/flags` | Flag inventory |
| `/debt` | Stale / expired / unused findings |
| `/owners` | Owner / squad mapping |
| `/freezes` | Freeze windows + cleanup cases |
| `/imports` | Inventory sync batches |
| `/compare` | A debt-aware vs B ignore-stale |
| `/scoreboard` | Project / debt leaderboard |
| `/settings` | Org, members, webhooks, export |
| `/honesty` | Soft-sim fence + Sources |

Forbidden primary IA: `/jobs` `/lifecycle` `/scenario` `/batch` `/audit` `/goldens`

## Dual score
| Impl | Meaning |
|------|---------|
| **A** | Debt-aware: classify stale/expired/unused → cleanup queue + blast radius |
| **B** | Ignore-stale: ship with inventory as-is; no debt scoring |

## Feature matrix (≥25)
1–5 Landing, pricing, demo, onboarding, flows  
6–10 Flag CRUD, expiry lock, search, project tag, archive  
11–15 Import sync, debt classify, owner map, freeze case, compare A/B  
16–20 Scoreboard, honesty, org settings, members, bearer auth  
21–25 Rate-limit feedback, webhook HMAC, export JSON/CSV, features API, goldens API  
26–28 Audit trail, try.html, in-app guide  

## Aggregates
FlagProject, FeatureFlag, FlagOwner, DebtFinding, FreezeWindow, CleanupCase, CompareResult (+ Org/Members/Audits)
