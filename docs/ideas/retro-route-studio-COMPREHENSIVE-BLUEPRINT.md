# Comprehensive Blueprint — Retro Route Studio

## Category
Chem / synthesis-planning eval bench (soft-sim). Must-haves: versioned route packs, dual compare, scoreboard, audit, export, org/settings, search, webhooks, honesty fence.

## Pages (≥11)

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing — brand-first soft-sim planning story |
| `/pricing` | Bench seats + private route pack tiers |
| `/demo` | Guided pack → route → memory → compare walkthrough |
| `/onboarding` | Checklist: org, pack, route, memory cell, compare, honesty |
| `/flows` | Index of ≥5 named journeys with entry CTAs |
| `/packs` | Versioned route pack registry |
| `/routes` | Multi-step candidate route workspace |
| `/memory` | Structured search-memory board |
| `/intermediates` | Intermediate property workspace |
| `/compare` | Agentic memory (A) vs naive local (B) |
| `/scoreboard` | Leaderboard of compares / winners |
| `/settings` | Org, members, webhook, export, rate limit |
| `/honesty` | Soft-sim / non-certification fence |

## Named user flows (≥5)

1. **First-run onboarding** — Planner acks honesty, sets org, creates first pack; success = checklist ≥80%.
2. **Pack → route → memory → score** — Create pack, add multi-step route, record tried memory cell, preview score.
3. **Structured-memory vs naive compare** — Run dual compare on a route; success = winner + gap on scoreboard.
4. **Intermediate property review** — Add intermediates with properties, link into memory cells, export JSON.
5. **Audit + export for reviewer** — Viewer opens audits, exports compares CSV; success = download + audit rows.
6. **Pricing-tier selection** — Lead reviews tiers, returns to packs with seating context (method-lab honesty).
7. **Webhook inbound pack event** — Ops posts signed webhook with Idempotency-Key; duplicate returns 200 duplicate.

## Platform must-haves
Versioned packs · dual compare · scoreboard · audit trail · JSON/CSV export · org + members · bearer auth · rate limit · idempotent webhook · feature inventory · search/filter on packs/routes · honesty page · offline try.html

## Dual score
- **A `scoreStructuredMemory`**: rewards memoryCoverage, triedPathRecall, intermediateCoverage, branchAvoidance; discounts greedyFluency.
- **B `scoreNaiveLocal`**: rewards singleStepFluency + localGreedyFit; weak on global memory.

## Feature matrix (≥25)

1. Marketing landing
2. Pricing tiers
3. Step demo
4. Onboarding checklist
5. Multi-flow index
6. Honesty fence
7. Route pack CRUD (create/list/archive)
8. Pack versioning
9. Candidate route create/list
10. Route step editor fields
11. Search memory board create/list
12. Memory outcome tagging
13. Intermediate create/list
14. Intermediate property fields
15. Dual A/B compare
16. Scoreboard
17. Score preview
18. Audit log
19. Export routes JSON
20. Export compares CSV
21. Org settings
22. Member invite + roles
23. Webhook ingest + HMAC
24. Bearer auth
25. Rate-limit feedback
26. Feature inventory API
27. Goldens sample API
28. Search/filter packs
29. Offline try.html
30. In-app guide link

## Aggregates
OrgSettings, Member, RoutePack, CandidateRoute, SearchMemoryCell, Intermediate, RouteCompare, AuditEntry, WebhookEvent

## Test themes
Goldens A≡B twin + fixture match · store feature count ≥25 · UI critical all pages + no desk clones · app-up live build/start
