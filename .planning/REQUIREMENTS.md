# Requirements: Commitment Coverage Studio

**Defined:** 2026-08-07  
**Core Value:** Show where commitments are under-covered or wasted, in dollars, before renewal.

## v1 Requirements

### Trust & marketing

- [x] **MKT-01**: Stranger landing `/` sells dollar coverage gap before renewal with brand-first hero
- [x] **MKT-02**: `/honesty` states soft-sim fence (not billing SOR; not Idle Seat / True Up) with Sources
- [x] **MKT-03**: DESIGN tokens applied (no isomorphic desk chrome)

### Domain claim

- [ ] **DOM-01**: Commitment inventory CRUD with lock window, search, multi-cloud tag, archive on `/commitments`
- [ ] **DOM-02**: Usage/billing import batches with status on `/imports`
- [ ] **DOM-03**: Coverage % and $ by account/window on `/coverage`
- [ ] **DOM-04**: Under-cover + unused-commit gap findings in $ on `/gaps`
- [ ] **DOM-05**: Scorer A commit-matched coverage path
- [ ] **DOM-06**: Scorer B on-demand-blind baseline path
- [ ] **DOM-07**: Side-by-side A vs B on `/compare` with material $ divergence
- [ ] **DOM-08**: ≥30 dual-impl goldens + goldens/features APIs

### Studio surfaces

- [ ] **UI-01**: `/renewals` renewal cases with buy/reduce/hold recommendations
- [ ] **UI-02**: `/scoreboard` account/gap leaderboard
- [ ] **UI-03**: Domain IA only — no `/jobs` `/lifecycle` `/scenario` `/batch` primary shells

### Commercial & platform

- [ ] **COM-01**: `/pricing` seats + connected-account tiers (no live card checkout)
- [ ] **COM-02**: `/demo` guided Import → Match → Gap → Renew including A vs B
- [ ] **COM-03**: `/onboarding` first-run checklist with progress
- [ ] **COM-04**: `/flows` index with ≥5 named journeys and CTAs
- [ ] **PLT-01**: Org settings + members + bearer auth
- [ ] **PLT-02**: Webhook HMAC inbound (soft-sim events)
- [ ] **PLT-03**: Export JSON/CSV for gaps/renewals/compare
- [ ] **PLT-04**: Audit trail (not primary IA)
- [ ] **PLT-05**: Rate-limit feedback on APIs

### Sustain bar

- [ ] **SUS-01**: ≥25 real features and ≥11 pages including required commercial routes
- [ ] **SUS-02**: Live `next build` + app-up smoke (`GET /`)
- [ ] **SUS-03**: README embeds live screenshots (landing, primary workspace, pricing, demo, onboarding/flows)
- [ ] **SUS-04**: `try.html` offline dual-claim digest + in-app guide link

## v2 Requirements

- Live cloud console connectors (out of soft-sim fence for v1)
- Auto-purchase / commit procurement automation

## Out of Scope

| Feature | Reason |
|---------|--------|
| Single-cloud Cost Explorer clone | Fence is multi-cloud + renewal workflow |
| Idle Seat / True Up clones | Different buyers and aggregates |
| Isomorphic desk shells | Lab ban |
| Devices / clinical / wet-lab / retail novelty | biz-rubric-v2 ban |
| Real payment checkout | Lab packaging only |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| MKT-01 | Phase 1 | Complete |
| MKT-02 | Phase 1 | Complete |
| MKT-03 | Phase 1 | Complete |
| DOM-01 | Phase 2 | Pending |
| DOM-02 | Phase 2 | Pending |
| DOM-03 | Phase 2 | Pending |
| DOM-04 | Phase 2 | Pending |
| DOM-05 | Phase 2 | Pending |
| DOM-06 | Phase 2 | Pending |
| DOM-07 | Phase 2 | Pending |
| DOM-08 | Phase 2 | Pending |
| UI-02 | Phase 3 | Pending |
| UI-03 | Phase 3 | Pending |
| UI-01 | Phase 4 | Pending |
| COM-01 | Phase 4 | Pending |
| COM-02 | Phase 4 | Pending |
| COM-03 | Phase 4 | Pending |
| COM-04 | Phase 4 | Pending |
| PLT-01 | Phase 4 | Pending |
| PLT-02 | Phase 4 | Pending |
| PLT-03 | Phase 4 | Pending |
| PLT-04 | Phase 4 | Pending |
| PLT-05 | Phase 4 | Pending |
| SUS-01 | Phase 5 | Pending |
| SUS-02 | Phase 5 | Pending |
| SUS-03 | Phase 5 | Pending |
| SUS-04 | Phase 5 | Pending |

**Coverage:** 27/27 v1 requirements mapped ✓

---
*Requirements defined: 2026-08-07*  
*Last updated: 2026-08-07 after gsd-roadmapper*
