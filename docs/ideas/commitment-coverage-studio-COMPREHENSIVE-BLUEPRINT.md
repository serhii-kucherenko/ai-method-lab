# Blueprint — Commitment Coverage Studio

## Pages (≥11)
| Route | Purpose |
|-------|---------|
| `/` | Marketing — sell $ coverage gap before renewal |
| `/pricing` | Seats + connected-account usage tiers |
| `/demo` | Import → match → gap → renewal pack |
| `/onboarding` | First-run checklist |
| `/flows` | ≥5 journeys (import, multi-cloud rollup, renew pack, compare, export) |
| `/commitments` | Commitment inventory |
| `/coverage` | Coverage % and $ by account/window |
| `/gaps` | Under-cover + unused commit findings |
| `/renewals` | Renewal cases + recommended actions |
| `/imports` | Billing/usage import batches |
| `/compare` | A commit-matched vs B on-demand-blind |
| `/scoreboard` | Account / gap leaderboard |
| `/settings` | Org, members, webhooks, export |
| `/honesty` | Soft-sim fence + Sources |

Forbidden primary IA: `/jobs` `/lifecycle` `/scenario` `/batch` `/audit` `/goldens`

## Dual score
| Impl | Meaning |
|------|---------|
| **A** | Commit-matched coverage: inventory ↔ usage → gap $ |
| **B** | On-demand-blind: ignore commitments; bill-as-you-go narrative only |

## Feature matrix (≥25)
1–5 Landing, pricing, demo, onboarding, flows  
6–10 Commitment CRUD, lock window, search, multi-cloud tag, archive  
11–15 Usage import, coverage compute, gap list, renew case, compare A/B  
16–20 Scoreboard, honesty, org settings, members, bearer auth  
21–25 Rate-limit feedback, webhook HMAC, export JSON/CSV, features API, goldens API  
26–28 Audit trail, try.html, in-app guide  

## Aggregates
CloudAccount, Commitment, UsageSlice, CoverageSnapshot, GapFinding, RenewalCase, CompareResult (+ Org/Members/Audits)
