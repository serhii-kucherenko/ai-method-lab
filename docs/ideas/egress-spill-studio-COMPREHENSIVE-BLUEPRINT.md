# Blueprint — Egress Spill Studio

## Pages (≥11)
| Route | Purpose |
|-------|---------|
| `/` | Marketing — sell $ egress spill before invoice |
| `/pricing` | Seats + egress-window sync tiers |
| `/demo` | Import → match budget → spill → invoice pack |
| `/onboarding` | First-run checklist |
| `/flows` | ≥5 journeys (import, spill triage, invoice pack, compare, export) |
| `/budgets` | Transfer budget lines |
| `/egress` | Egress / transfer usage |
| `/spills` | Over-budget spill findings |
| `/invoices` | Invoice cases + actions |
| `/imports` | Billing/usage import batches |
| `/compare` | A budget-aware vs B ignore-egress |
| `/scoreboard` | Account / spill leaderboard |
| `/settings` | Org, members, webhooks, export |
| `/honesty` | Soft-sim fence + Sources |

Forbidden primary IA: `/jobs` `/lifecycle` `/scenario` `/batch` `/audit` `/goldens`

## Dual score
| Impl | Meaning |
|------|---------|
| **A** | Budget-aware: egress ↔ budget → spill $ |
| **B** | Ignore-egress: chart totals only; no budget match |

## Feature matrix (≥25)
1–5 Landing, pricing, demo, onboarding, flows  
6–10 Budget CRUD, window lock, search, multi-cloud tag, archive  
11–15 Egress import, spill compute, invoice case, compare A/B, evidence export  
16–20 Scoreboard, honesty, org settings, members, bearer auth  
21–25 Rate-limit feedback, webhook HMAC, export JSON/CSV, features API, goldens API  
26–28 Audit trail, try.html, in-app guide  

## Aggregates
CloudAccount, TransferBudget, EgressSlice, SpillFinding, InvoiceCase, CompareResult (+ Org/Members/Audits)
