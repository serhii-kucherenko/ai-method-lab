# Feature Research

**Domain:** Cloud FinOps / commitment-coverage soft-sim studio  
**Product:** Commitment Coverage Studio  
**Researched:** 2026-08-07  
**Confidence:** HIGH (lab bar + depth pack); MEDIUM (FinOps category table stakes from market sources)

## Quality gate checklist

- [x] ≥25 concrete features listed (32 counted below)
- [x] Dual A/B scoring called out
- [x] Forbidden IA listed
- [x] Confidence levels assigned
- [x] Phase-sized clusters for roadmap
- [x] Commercial pages + platform must-haves included

## Forbidden IA (hard ban)

Do **not** use as primary nav or desk shell (isomorphic clone fail per `docs/COMPREHENSIVE_PRODUCT.md`):

| Forbidden route / shell | Why |
|-------------------------|-----|
| `/jobs` | Generic desk job queue costume |
| `/lifecycle` | Noun-swap lifecycle board |
| `/scenario` | Scenario shell without commitment domain |
| `/batch` | Batch-desk primary IA |
| `/audit` as primary workspace | Audit is a settings/platform surface, not the product home |
| `/goldens` as primary nav | Goldens live behind compare / API / scoreboard, not a desk tab |

**Also ban:** Idle Seat (`/seats` / waste-reclaim) and True Up (vendor license meters) clones; single-cloud Cost Explorer noun-swap.

**Required domain IA instead:** `/commitments` `/coverage` `/gaps` `/renewals` `/imports` `/compare` `/scoreboard` (+ commercial `/` `/pricing` `/demo` `/onboarding` `/flows` `/honesty` `/settings`).

## Dual A/B scoring (must ship)

| Impl | Name | Behavior | User-visible surface |
|------|------|----------|----------------------|
| **A** | Commit-matched | Match commitment inventory ↔ usage slices → coverage % and **gap $** (under-cover + unused commit) | `/coverage`, `/gaps`, `/compare`, goldens API |
| **B** | On-demand-blind | Ignore commitments; narrate bill-as-you-go only (no coverage credit) | `/compare` side-by-side vs A |
| Harness | ≥30 goldens | Dual-impl verify; features/goldens APIs | `/compare` + scoreboard honesty |

Missing dual compare or collapsing A/B into one scorer fails the unique claim.

---

## Feature Landscape

### Table Stakes (Users Expect These)

FinOps buyers expect coverage **and** utilization expressed in dollars before renewal — not charts without a renewal action. Confidence: **MEDIUM** (FinOps Foundation commitment-discount guidance; Cloudaware / SP KPI practice) + **HIGH** for lab commercial surfaces.

| # | Feature | Why Expected | Complexity | Notes |
|---|---------|--------------|------------|-------|
| 1 | Marketing landing `/` | Sell $ gap before renewal | LOW | Brand-first; CTA to `/commitments` + `/demo` |
| 2 | `/pricing` seats + connected-account tiers | Method-lab packaging honesty | LOW | Evaluator / Platform / Site; no live checkout |
| 3 | `/demo` guided happy path | Stranger completes Import → Match → Gap → Renew | MEDIUM | Must show A vs B |
| 4 | `/onboarding` checklist + progress | First-run not a docs wall | LOW | Visible progress states |
| 5 | `/flows` multi-flow index | ≥5 named journeys with CTAs | MEDIUM | Not footer-only |
| 6 | `/honesty` soft-sim fence | Not billing SOR; not Idle Seat / True Up | LOW | Sources footer |
| 7 | Commitment inventory `/commitments` | Know what was purchased | MEDIUM | CRUD + lock window + archive |
| 8 | Multi-cloud account tags | Fence vs single-cloud console | MEDIUM | AWS / GCP / Azure tags on accounts & commits |
| 9 | Usage / billing import `/imports` | Match needs usage slices | MEDIUM | Batch status + failed-batch detail |
| 10 | Coverage board `/coverage` | Coverage % and $ by account / lock window | HIGH | Twin KPI: coverage |
| 11 | Gap findings `/gaps` | Under-cover + unused (stranded) commit in $ | HIGH | Twin KPI: utilization waste |
| 12 | Renewal cases `/renewals` | Walk into renewal with actions | HIGH | Buy / reduce / hold recommendations |
| 13 | Dual compare `/compare` A vs B | Differentiator + claim proof | HIGH | Commit-matched vs on-demand-blind |
| 14 | Export JSON/CSV | Reviewer / CFO pack | LOW | From gaps, renewals, compare |
| 15 | Org settings + members | Multi-tenant platform baseline | MEDIUM | Roles on `/settings` |
| 16 | Search / filters on inventory & gaps | Scale beyond demo fixtures | LOW | Account, cloud, window, status |
| 17 | Audit trail (platform, not primary IA) | Who changed commits / imports | MEDIUM | Settings or side panel — **not** `/audit` desk |

### Differentiators (Competitive Advantage)

| # | Feature | Value Proposition | Complexity | Notes |
|---|---------|-------------------|------------|-------|
| 18 | Gap $ as primary outcome | Dollar gaps before renewal, not chart museum | MEDIUM | Hero metric on gaps + renewals |
| 19 | Renewal action pack | Recommended actions tied to renew-by dates | HIGH | Exportable pack for meeting |
| 20 | Scoreboard `/scoreboard` | Account / gap leaderboard for rollup reviews | MEDIUM | Multi-cloud rollup flow entry |
| 21 | Dual-impl goldens API (≥30) | Prove A ≠ B; method-lab credibility | HIGH | Behind compare / features API |
| 22 | Lock-window aware matching | Coverage by commitment term, not vague month | MEDIUM | Aggregate: CoverageSnapshot |
| 23 | Features API + rate-limit feedback | Platform honesty for automation | LOW | Lab standard |
| 24 | Webhook HMAC (idempotent inbound) | Org automation without fake “live billing” | MEDIUM | Soft-sim events only |
| 25 | Offline `try.html` | Digest demo of dual claim | LOW | Not a substitute for multi-page app |
| 26 | In-app best-practices guide link | Tutor surface before sustain | LOW | Points at `docs/guides/` |

### Anti-Features (Do Not Build)

| Anti-Feature | Why Requested | Why Problematic | Alternative |
|--------------|---------------|-----------------|-------------|
| Live Cost Explorer / billing SOR | “Connect real AWS” | Out of soft-sim fence; compliance theater | Import batches + honesty fence |
| `/jobs` `/lifecycle` `/scenario` desk | Fast scaffold from prior studios | Isomorphic clone — instant shallow fail | Domain IA above |
| Seat waste / license true-up | Adjacent FinOps | Idle Seat / True Up clones | Commitment inventory only |
| Single dual-approval status board | Looks “enterprise” | Does not count as domain feature | Renewal cases with $ actions |
| Real card checkout on `/pricing` | Monetization cosplay | Lab packaging only | Hypothetical tiers + honesty |
| Auto-purchase commitments | “Close the loop” | Device/procure risk; wrong product | Recommend buy/reduce/hold only |
| One calculator page + A/B toggle | Pass goldens fast | Fails ≥11 pages / ≥5 flows / ≥25 features | Full page map |

---

## Phase-sized feature clusters (roadmap feed)

Order matches `commitment-coverage-studio-PHASE-BRIEFS.md` and dependency graph. Each cluster is one roadmap phase-sized bite.

### Cluster 1 — Smoke & trust (commercial seed)

**Ship:** #1 landing, #6 honesty, Sources, display-name smoke.  
**Exit:** Live `/` smoke asserts brand + fence.  
**Avoids:** Desk shell; invented metrics in hero.

### Cluster 2 — Domain claim core

**Ship:** #7 commitments (+ lock window, archive), #8 multi-cloud tags, #9 imports, #10 coverage, #11 gaps, #13 dual A/B, #21 goldens (≥30), #22 lock-window snapshots.  
**Exit:** Store/API tests for match + compare; gap $ present.  
**Avoids:** Shipping UI without dual scorers; collapsing B into A.

### Cluster 3 — Studio UI (domain pages live)

**Ship:** Full routes per PAGE-SPECS: `/commitments` `/coverage` `/gaps` `/renewals` `/imports` `/compare` `/scoreboard`; #16 search/filters; empty/error paths.  
**Exit:** UI critical path each domain page.  
**Avoids:** Stub pages; `/jobs` leftovers.

### Cluster 4 — Renewals, commercial, platform

**Ship:** #2 pricing, #3 demo, #4 onboarding, #5 flows (≥5), #12 renewal packs, #14 export, #15 org/members, #17 audit trail, #19 renewal actions, #20 scoreboard polish, #23 features API + rate limits, #24 webhooks, bearer auth.  
**Exit:** Flow CTAs runnable; settings validation works.  
**Avoids:** Footer-only flows; real checkout.

### Cluster 5 — Sustain bar

**Ship:** #25 try.html, #26 in-app guide, README live screenshots (landing, primary workspace, pricing, demo, onboarding/flows), `next build` + app-up, tutor guide, business scorecard.  
**Exit:** ≥25 features, ≥11 pages, ≥5 flows verified.  
**Avoids:** try.html-only screenshots; API-green without live app.

---

## Named user flows (≥5 — must appear on `/flows`)

| Flow | Actor | Job | Pages | Success | Empty / failure |
|------|-------|-----|-------|---------|-----------------|
| F1 Import & match | FinOps analyst | Load commits + usage | `/onboarding` → `/imports` → `/commitments` → `/coverage` | Coverage snapshot with $ | Failed batch detail |
| F2 Multi-cloud rollup | Platform lead | See gaps across clouds | `/scoreboard` → `/gaps` (filter cloud) | Ranked gap $ by account | Empty org |
| F3 Renewal pack | FinOps lead | Walk into renewal meeting | `/renewals` → export | Pack with recommended actions + renew-by | No renew-by dates |
| F4 Dual compare | Skeptical buyer / reviewer | Prove commit-matched beats blind | `/compare` (+ goldens) | A gap $ ≠ B narrative; scores shown | Missing usage or commits |
| F5 Export & review | Finance partner | Take evidence out of app | `/gaps` or `/renewals` → export → `/settings` audit | CSV/JSON downloaded; audit row | Auth missing |

Optional sixth (nice, not required for bar): webhook inbound ack after import event.

---

## Feature Dependencies

```
Cloud accounts + multi-cloud tags
    └──requires──> Commitment inventory (lock windows)
                       └──requires──> Usage import batches
                              └──requires──> Coverage snapshots
                                     ├──requires──> Gap findings ($ under-cover + unused)
                                     │      └──requires──> Renewal cases / action pack
                                     └──requires──> Dual compare A vs B
                                            └──requires──> Goldens (≥30) + scoreboard

Commercial (/pricing /demo /onboarding /flows) ──enhances──> Domain (does not replace claim)
Export / webhooks / org ──enhances──> Renewal pack & import automation
Honesty fence ──conflicts──> Live billing SOR / auto-purchase
Domain IA ──conflicts──> /jobs /lifecycle /scenario shells
```

### Dependency notes

- **Coverage requires inventory + usage:** No match without both aggregates.  
- **Renewals require gaps:** Actions without $ findings are theater.  
- **Compare requires both scorers runnable on same fixtures.**  
- **Flows require domain pages live** — do not mark commercial “done” on stubs.

---

## MVP Definition (comprehensive bar = launch bar)

This lab product does **not** ship a thin MVP; the sustain bar **is** the launch bar.

### Launch With (v1 / sustain)

- [ ] All table stakes #1–#17  
- [ ] Differentiators #18–#26 (dual A/B + goldens mandatory)  
- [ ] ≥5 flows on `/flows`  
- [ ] ≥11 pages including commercial set  
- [ ] Live build + app-up + README screenshots  

### Add After Validation (v1.x)

- [ ] Laddered commitment calendar heatmaps — after buyers use renewal packs  
- [ ] Forecast buffer / break-even helpers — after goldens stable  
- [ ] More cloud-native attribute mappers (RI family ↔ SP hourly) — when import fidelity hurts trust  

### Future Consideration (v2+)

- [ ] Read-only connectors to real billing APIs (still soft-sim fence unless product pivots)  
- [ ] EDP / enterprise discount negotiation narratives  

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority | Cluster |
|---------|------------|---------------------|----------|---------|
| Dual A/B + goldens | HIGH | HIGH | P1 | 2 |
| Coverage + gap $ | HIGH | HIGH | P1 | 2 |
| Commitment inventory + import | HIGH | MEDIUM | P1 | 2 |
| Renewal action pack | HIGH | MEDIUM | P1 | 4 |
| Domain pages UI | HIGH | MEDIUM | P1 | 3 |
| `/flows` ≥5 + demo/onboarding/pricing | HIGH | MEDIUM | P1 | 4 |
| Landing + honesty | HIGH | LOW | P1 | 1 |
| Export + org + webhooks + audit | MEDIUM | MEDIUM | P1 | 4 |
| Scoreboard | MEDIUM | LOW | P1 | 3–4 |
| try.html + guide + screenshots | MEDIUM | LOW | P1 | 5 |
| Forecast / break-even extras | MEDIUM | HIGH | P2 | post-sustain |
| Live billing connectors | LOW (for soft-sim) | HIGH | P3 | defer |

**Priority key:** P1 = required for comprehensive sustain; P2 = after validation; P3 = out of scope unless pivot.

---

## Concrete feature count (32 ≥ 25)

1. Marketing landing `/`  
2. Pricing tiers `/pricing`  
3. Guided demo `/demo`  
4. Onboarding checklist `/onboarding`  
5. Multi-flow index `/flows`  
6. Honesty / soft-sim fence `/honesty`  
7. Commitment inventory CRUD  
8. Lock window on commitments  
9. Archive commitments  
10. Search / filters  
11. Multi-cloud tags  
12. Cloud account registry  
13. Usage/billing import batches  
14. Failed import batch detail  
15. Coverage compute (% and $)  
16. Coverage snapshots by account/window  
17. Gap list — under-coverage $  
18. Gap list — unused/stranded commit $  
19. Renewal cases + renew-by  
20. Recommended renewal actions (buy/reduce/hold)  
21. Dual compare A commit-matched vs B on-demand-blind  
22. Scoreboard / account gap leaderboard  
23. Org settings  
24. Member invite / roles  
25. Bearer auth  
26. Rate-limit feedback  
27. Webhook HMAC (idempotent)  
28. Export JSON/CSV  
29. Features API  
30. Goldens API / dual-impl verify (≥30)  
31. Audit trail (non-primary IA)  
32. Offline try.html + in-app guide link  

CRUD alone counts at most 3 toward the 25; the list above is capability-level, not row CRUD theater.

---

## Competitor / category feature analysis

| Capability | Native cloud consoles | FinOps platforms (e.g. Cloudaware-class) | Our approach |
|------------|----------------------|------------------------------------------|--------------|
| Coverage % | SP/RI coverage reports | Multi-cloud coverage dashboards | Soft-sim coverage $ + % by window |
| Utilization | SP/RI utilization | Utilization + effective cost | Unused-commit gap $ (stranded) |
| Renewal workflow | Weak / manual calendar | Planning cycle guidance | First-class `/renewals` action pack |
| Dual baseline | Rare | Single “optimized” narrative | Explicit A vs B compare + goldens |
| Multi-cloud | Per-vendor | Cross-cloud | Tags + rollup scoreboard (fence) |
| Live billing | Yes | Often | **No** — import + honesty |

Confidence: **MEDIUM** for market rows (web sources); **HIGH** for “our approach” (depth pack).

---

## Platform must-haves (FinOps / cost-infra category)

From `docs/COMPREHENSIVE_PRODUCT.md` Cost / infra row + depth pack:

| Must-have | Ship as | Cluster |
|-----------|---------|---------|
| Budgets / plan packs analogue | Renewal packs + recommended actions | 4 |
| Compare vs naive baseline | Dual A vs B (on-demand-blind) | 2–3 |
| Compile/runtime honesty | `/honesty` + soft-sim copy | 1 |
| Settings | Org, members, webhook, export | 4 |
| Audit / export | Audit trail + CSV/JSON | 4 |
| Search | Inventory & gaps filters | 3 |
| Auth + multi-tenant | Bearer + org | 4 |
| Notifications of rejects | Import failure + rate-limit UI | 3–4 |

---

## Sources

| Source | Role | Confidence |
|--------|------|------------|
| `docs/COMPREHENSIVE_PRODUCT.md` | Lab hard minimums (≥25 features, ≥11 pages, ≥5 flows, commercial, platform) | HIGH |
| `docs/ideas/commitment-coverage-studio-COMPREHENSIVE-BLUEPRINT.md` | Page map, dual score, feature matrix, aggregates | HIGH |
| `docs/ideas/commitment-coverage-studio-PAGE-SPECS.md` | Route jobs, empty/error, forbidden IA | HIGH |
| `docs/ideas/commitment-coverage-studio-PHASE-BRIEFS.md` | Phase exits → cluster order | HIGH |
| `.planning/PROJECT.md` | Buyer outcome, active requirements | HIGH |
| [FinOps Foundation — Purchasing commitment discounts in AWS](https://www.finops.org/wg/purchasing-commitment-discounts-in-aws/) | Analysis → Purchase → Review → Remedy cycle | MEDIUM |
| [FinOps Foundation — Commitment-based discounts overview](https://www.finops.org/wg/commitment-based-discounts-overview/) | Spend- vs resource-based commit types | MEDIUM |
| [Cloudaware — Commitments & Reservations](https://docs.cloudaware.com/DOCS/finops-usage-rate-optimization-commit-reservations) | Coverage + utilization as twin KPIs, multi-cloud | MEDIUM |
| [Usage AI — Savings Plan KPIs](https://www.usage.ai/blogs/aws/guides/savings-plan-monitoring/aws-savings-plan-kpis) | Coverage / utilization as table stakes | MEDIUM |
| Idle Seat blueprint (anti-clone) | Confirm seat-waste IA is out of scope | HIGH |

---

*Feature research for: Commitment Coverage Studio (FinOps commitment-coverage soft-sim)*  
*Researched: 2026-08-07*  
*Do not commit from researcher — orchestrator commits after parallel researchers finish.*
