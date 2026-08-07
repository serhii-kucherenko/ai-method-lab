# Roadmap: Commitment Coverage Studio

## Overview

Ship a FinOps soft-sim that imports multi-cloud commitment inventory and usage, computes under-coverage and unused-commit gaps in dollars, and compares commit-matched (A) vs on-demand-blind (B) so platform leads open renewals with a dollar gap — not a chart museum. Journey: honesty + brand smoke → falsifiable dual claim → domain pages → renewals/commercial/platform → live sustain bar.

## Phases

- [ ] **Phase 1: Smoke & trust** - Brand landing, honesty fence, and DESIGN tokens before domain theater
- [ ] **Phase 2: Domain claim core** - Inventory, imports, coverage/gaps, dual scorers, and ≥30 goldens
- [ ] **Phase 3: Studio UI** - Live domain IA pages with filters and empty/error paths
- [ ] **Phase 4: Renewals, commercial, platform** - Renewal packs, commercial surfaces, and platform must-haves
- [ ] **Phase 5: Sustain bar** - Live build, app-up smoke, README screenshots, try.html, feature bar

## Phase Details

### Phase 1: Smoke & trust
**Goal**: Strangers see a brand-first soft-sim that sells dollar coverage gap before renewal, with an explicit honesty fence
**Depends on**: Nothing (first phase)
**Requirements**: MKT-01, MKT-02, MKT-03
**Success Criteria** (what must be TRUE):
  1. Visitor opens `/` and sees Commitment Coverage Studio as the hero brand selling dollar gap before renewal (not a generic lab desk)
  2. Visitor opens `/honesty` and reads soft-sim fence (not billing SOR; not Idle Seat / True Up) with Sources
  3. Visible UI uses DESIGN tokens (Fraunces / Source Sans 3 / teal covered / rust gap) without isomorphic desk chrome
**Plans**: TBD
**UI hint**: yes

### Phase 2: Domain claim core
**Goal**: Coverage and gap dollars are computable from multi-cloud inventory + usage, with a falsifiable A vs B claim
**Depends on**: Phase 1
**Requirements**: DOM-01, DOM-02, DOM-03, DOM-04, DOM-05, DOM-06, DOM-07, DOM-08
**Success Criteria** (what must be TRUE):
  1. Analyst can create, search, tag (multi-cloud), lock-window, and archive commitments (durable store + API)
  2. Analyst can import usage/billing batches and see batch status including failures
  3. System produces coverage %/$ by account/window and separate under-cover + unused-commit gap findings in dollars (scorer A)
  4. Same fixtures yield material $ divergence between commit-matched (A) and on-demand-blind (B) on compare, backed by ≥30 dual-impl goldens
**Plans**: TBD

### Phase 3: Studio UI
**Goal**: Domain routes are real product surfaces (not stubs) with commit-native IA only
**Depends on**: Phase 2
**Requirements**: UI-02, UI-03
**Success Criteria** (what must be TRUE):
  1. User can navigate live `/commitments` `/coverage` `/gaps` `/renewals` `/imports` `/compare` `/scoreboard` and complete critical paths with search/filters and empty/error states
  2. User can open `/scoreboard` and see an account/gap leaderboard rollup across clouds
  3. Primary nav has no `/jobs` `/lifecycle` `/scenario` `/batch` desk shells (audit/goldens not primary IA)
**Plans**: TBD
**UI hint**: yes

### Phase 4: Renewals, commercial, platform
**Goal**: FinOps leads leave with a renewal action pack; strangers can price, demo, onboard, and run ≥5 flows; platform baselines work
**Depends on**: Phase 3
**Requirements**: UI-01, COM-01, COM-02, COM-03, COM-04, PLT-01, PLT-02, PLT-03, PLT-04, PLT-05
**Success Criteria** (what must be TRUE):
  1. User can open `/renewals`, see cases with buy/reduce/hold recommendations tied to gap $, and export a renewal pack
  2. Stranger can use real `/pricing` (seats + connected-account tiers, no live checkout), `/demo` (Import → Match → Gap → Renew including A vs B), `/onboarding` (checklist with progress), and `/flows` (≥5 named journeys with CTAs)
  3. Org admin can manage settings/members with bearer auth, receive HMAC-verified soft-sim webhooks, export gaps/renewals/compare as JSON/CSV, and see audit trail (non-primary) plus rate-limit feedback on APIs
**Plans**: TBD
**UI hint**: yes

### Phase 5: Sustain bar
**Goal**: The running product meets the lab comprehensive finish gate
**Depends on**: Phase 4
**Requirements**: SUS-01, SUS-02, SUS-03, SUS-04
**Success Criteria** (what must be TRUE):
  1. Product exposes ≥25 real features and ≥11 pages including required commercial routes
  2. `next build` succeeds and live app-up smoke returns OK for `GET /` with display name
  3. README embeds live screenshots (landing, primary workspace, pricing, demo, onboarding/flows) from `screenshots/` of the running app
  4. Offline `try.html` dual-claim digest exists with an in-app guide link
**Plans**: TBD
**UI hint**: yes

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Smoke & trust | 0/TBD | Not started | - |
| 2. Domain claim core | 0/TBD | Not started | - |
| 3. Studio UI | 0/TBD | Not started | - |
| 4. Renewals, commercial, platform | 0/TBD | Not started | - |
| 5. Sustain bar | 0/TBD | Not started | - |

## Coverage map

| Requirement | Phase |
|-------------|-------|
| MKT-01 | Phase 1 |
| MKT-02 | Phase 1 |
| MKT-03 | Phase 1 |
| DOM-01 | Phase 2 |
| DOM-02 | Phase 2 |
| DOM-03 | Phase 2 |
| DOM-04 | Phase 2 |
| DOM-05 | Phase 2 |
| DOM-06 | Phase 2 |
| DOM-07 | Phase 2 |
| DOM-08 | Phase 2 |
| UI-02 | Phase 3 |
| UI-03 | Phase 3 |
| UI-01 | Phase 4 |
| COM-01 | Phase 4 |
| COM-02 | Phase 4 |
| COM-03 | Phase 4 |
| COM-04 | Phase 4 |
| PLT-01 | Phase 4 |
| PLT-02 | Phase 4 |
| PLT-03 | Phase 4 |
| PLT-04 | Phase 4 |
| PLT-05 | Phase 4 |
| SUS-01 | Phase 5 |
| SUS-02 | Phase 5 |
| SUS-03 | Phase 5 |
| SUS-04 | Phase 5 |

**Coverage:** 27/27 v1 requirements mapped ✓

---
*Roadmap created: 2026-08-07*
