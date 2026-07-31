# Blueprint — Delegation Expiry Studio

## Pages (≥11)
| Route | Purpose |
|-------|---------|
| `/` | Marketing — sell time-boxed agent grants |
| `/pricing` | Fleet seats + grant-event usage |
| `/demo` | Grant → tick clock → expire → audit |
| `/onboarding` | Checklist + progress |
| `/flows` | ≥5 journeys |
| `/agents` | Agent registry |
| `/grants` | Active / scheduled TTL grants |
| `/expiries` | Expiry queue + history |
| `/policies` | Default TTL templates |
| `/audit` | Grant ledger (domain, not desk costume) |
| `/compare` | A TTL vs B permanent-scope |
| `/scoreboard` | Fleet / expiry leaderboard |
| `/settings` | Org, members, webhooks, export |
| `/honesty` | Soft-sim fence |

Forbidden primary IA: `/jobs` `/lifecycle` `/scenario` `/batch` `/goldens`

## Dual score
| Impl | Meaning |
|------|---------|
| **A** | TTL grant + auto-expire + ledger |
| **B** | Permanent scope; no clock |

## Feature matrix (≥25)
1–5 Landing, pricing, demo, onboarding, flows  
6–10 Agents CRUD, grants create, TTL set, expire now, policy templates  
11–15 Expiry queue, audit ledger, compare A/B, scoreboard, search  
16–20 Honesty, org, members, bearer auth, rate-limit  
21–25 Webhook HMAC, export, features API, goldens API, audit trail  
26–28 try.html, in-app guide, fleet filter  

## Aggregates
Agent, DelegationGrant, ExpiryEvent, PolicyTemplate, CompareResult (+ Org/Members/Audits)
