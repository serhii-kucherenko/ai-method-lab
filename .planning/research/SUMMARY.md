# Project Research Summary

**Project:** Commitment Coverage Studio
**Domain:** FinOps commitment-coverage soft-sim (multi-cloud inventory → coverage/gap $ → renewal pack)
**Researched:** 2026-08-07
**Confidence:** HIGH

## Executive Summary

Commitment Coverage Studio is a Method Lab FinOps soft-sim: import multi-cloud commitment inventory and usage, compute under-coverage and unused-commit gaps in **dollars**, and compare a commit-matched path (A) against an on-demand-blind baseline (B) so platform leads walk into renewals with a gap $, not a chart museum. Experts in this category treat coverage and utilization as twin levers, then close a Review → Remedy loop with renewal actions — not live billing write-back.

**Recommended approach:** Lab-default stack only — Next.js 16 App Router + Tailwind 4 + shadcn + TypeScript domain scorers + SQLite (`better-sqlite3`) + bearer auth. **No Python sidecar.** Pure TS dual scorers in `src/domain/`, Vitest goldens (≥30 with intentional A≠B divergence), domain IA (`/commitments` `/coverage` `/gaps` `/renewals` `/imports` `/compare` `/scoreboard`), then commercial + platform surfaces to the comprehensive bar. Mirror Spend Cap / True Up / Idle Seat scaffold shape; never noun-swap their shells.

**Key risks:** (1) isomorphic Idle Seat / True Up / desk clones, (2) dual-score emptiness (A≈B theater), (3) coverage conflated with utilization, (4) single-cloud Cost Explorer skin, (5) stub commercial pages or missing live README screenshots. Mitigate by locking commit-native aggregates and IA before UI theater, falsifying A/B formulas + goldens before chrome, shipping honesty fence early, and treating sustain screenshots as a hard gate.

## Key Findings

### Recommended Stack

Use the AI Method Lab product stack with **no primary-stack exception**. Controllers lock Next App Router, Tailwind, shadcn, SQLite, bearer auth, Vitest + Playwright. Coverage math is pure billing arithmetic — keep dual scorers in TypeScript; do not add FastAPI/Python. Persist durable inventory/imports in SQLite (not in-memory-only demo stores). Greenfield pin via `create-next-app@latest` (Next **16.3.0**, React **19.2.8**); do not downgrade to older sibling locks.

**Core technologies:**
- **Next.js 16.3 (App Router):** Product UI + Route Handlers — lab-required framework
- **TypeScript ^5 + Vitest:** Dual scorers + ≥30 goldens as pure functions in `src/domain/` — no React in claim math
- **Tailwind 4 + shadcn (radix):** DESIGN tokens (Fraunces / Source Sans 3 / IBM Plex Mono; teal covered / rust gap) — compose, do not invent parallel UI kits
- **better-sqlite3 + Zod + bearer middleware:** Durable org-scoped aggregates + validated imports — CONTROLLER defaults
- **Playwright + app-up + screenshot script:** Live path + README PNGs before sustain

**Do not use:** Python sidecar, Postgres/cloud DB, NextAuth/Clerk, live Cost Explorer SDKs as required runtime, Tailwind v3 invent, isomorphic desk IA, Idle Seat / True Up noun-swap shells.

Details: [STACK.md](./STACK.md)

### Expected Features

Comprehensive bar **is** launch bar (no thin MVP). Research lists **32** capability-level features (≥25 required). Five named flows on `/flows`: Import & match, Multi-cloud rollup, Renewal pack, Dual compare, Export & review.

**Must have (table stakes):**
- Commitment inventory + lock windows + multi-cloud account tags
- Usage/billing import batches with failed-batch detail
- Coverage board (% and $ by account/window) + gap findings (under-cover **and** unused commit $)
- Dual compare A vs B + ≥30 goldens
- Renewal cases with buy/reduce/hold recommendations
- Commercial set: `/` `/pricing` `/demo` `/onboarding` `/flows` `/honesty`
- Org/members, search/filters, audit (non-primary), export JSON/CSV

**Should have (competitive):**
- Gap $ as primary outcome (not chart museum)
- Exportable renewal action pack tied to renew-by dates
- Scoreboard rollup across clouds
- Features API + rate-limit feedback, webhook HMAC, offline `try.html`, in-app guide link

**Defer (v2+):**
- Laddered commitment calendar heatmaps, forecast/break-even helpers, richer RI↔SP mappers
- Read-only live billing connectors, EDP negotiation narratives

**Forbidden:** Live billing SoR, `/jobs` `/lifecycle` `/scenario` desk shells, seat-waste / license true-up clones, auto-purchase commitments, real checkout, one-calculator A/B page.

Details: [FEATURES.md](./FEATURES.md)

### Architecture Approach

Layered soft-sim: Presentation (domain + commercial pages) → thin bearer API Route Handlers → application services (ImportOrchestrator, CoverageEngine, GapMaterializer, RenewalPacker, CompareService, ScoreboardRollup) → pure dual scorers + SQLite aggregates. CoverageEngine uses **A only** for snapshots/gaps/renewals; B appears on compare + scoreboard contrast. Gaps and snapshots are derived read models; Commitments + UsageSlices are sources of truth. Soft-sim fence is a first-class boundary (`/honesty`, claim constants, no live CUR write-back).

**Major components:**
1. **Inventory + Ingest** — CloudAccount, Commitment, ImportBatch, UsageSlice
2. **Coverage math** — CoverageSnapshot, GapFinding via scorer A; dual CompareResult via A+B
3. **Renewal workflow** — RenewalCase lifecycle (not a generic jobs desk)
4. **Platform** — Org, Members, Audit, Webhooks, Export, Features, Health
5. **Dual scorer harness** — Pure TS `scoreCommitMatched` / `scoreOnDemandBlind` + goldens asserting **divergence**, not twin-equivalence

**Bounded contexts stay separate:** Inventory | Ingest | Coverage math | Renewal | Compare claim | Platform. Multicloud: normalize tags/rollups; keep instrument type provider-specific (do not pretend SP ≡ CUD).

Details: [ARCHITECTURE.md](./ARCHITECTURE.md)

### Critical Pitfalls

1. **Isomorphic Idle Seat / True Up / desk clone** — Lock commit-native IA and aggregates; diff nav/ERD against siblings before first product commit
2. **Dual-score emptiness (A ≈ B)** — Falsify formulas and divergence goldens before UI chrome; never `return A()` for B
3. **Coverage vs utilization conflation** — Model unused-commit $ and on-demand spill $ as separate GapFinding kinds; different renewal actions
4. **Single-cloud Cost Explorer noun-swap** — Require ≥2 provider tags in seed/import and cross-cloud rollup renew pack
5. **Stub commercial pages / missing live screenshots / honesty collapse** — Real `/pricing` `/demo` `/onboarding` `/flows`; capture script against running app; soft-sim fence everywhere

Details: [PITFALLS.md](./PITFALLS.md)

## Implications for Roadmap

Based on research, suggested phase structure (**5 phases**). Order matches FEATURES clusters, PHASE-BRIEFS dependency graph, and architecture foundation → claim → UI → commercial/platform → sustain.

### Phase 1: Smoke & trust (commercial seed)
**Rationale:** Brand + honesty fence must exist before domain theater; prevents soft-sim overclaim and isomorphic landing drift.  
**Delivers:** Marketing `/`, `/honesty`, Sources footer, display-name smoke; DESIGN token baseline.  
**Addresses:** Features #1, #6; soft-sim fence.  
**Avoids:** Pitfall 5 (honesty collapse); invented metrics in hero; desk-shell landing.  
**Research flag:** Standard — skip deep research.

### Phase 2: Domain claim core (inventory, ingest, dual scorers)
**Rationale:** Coverage requires inventory + usage; renewals require gaps; compare requires both scorers on shared fixtures. Claim math must be falsifiable before page chrome.  
**Delivers:** CloudAccount/Commitment CRUD + lock windows + multi-cloud tags; ImportBatch/UsageSlice; CoverageSnapshot + GapFinding (A); CompareResult (A+B); ≥30 goldens with A≠B; SQLite schema + services.  
**Addresses:** Features #7–#11, #13, #21–#22 (cluster 2).  
**Avoids:** Pitfalls 1 (clone aggregates), 2 (empty dual), 6 (coverage≠utilization), 7 (single-cloud).  
**Research flag:** **YES** — matching policy (family/window attribution), multi-cloud dollarization, falsifiable A/B formulas, IA uniqueness vs Idle Seat / True Up.

### Phase 3: Studio UI (domain pages live)
**Rationale:** Domain routes must be real (not stubs) before commercial flows can call them; search/filters and empty/error paths prove product surface.  
**Delivers:** Full domain IA pages: `/commitments` `/coverage` `/gaps` `/renewals` `/imports` `/compare` `/scoreboard`; filters; empty/error UX.  
**Addresses:** Features #12, #16, #20 (partial); PAGE-SPECS critical paths.  
**Avoids:** Pitfall 1 (forbidden routes); stub pages.  
**Research flag:** Standard UI patterns (shadcn + DESIGN) — light research only if IA drift detected.

### Phase 4: Renewals, commercial, platform
**Rationale:** Renewal packs need live gaps; flows need live domain pages; platform must-haves complete cost/infra category bar. Commercial surfaces scheduled here (not deferred past smoke forever — seed was Phase 1; full set lands with renewals).  
**Delivers:** Renewal action packs + export; `/pricing` `/demo` `/onboarding` `/flows` (≥5 journeys); org/members/bearer; audit; webhooks HMAC; features API + rate limits; scoreboard polish.  
**Addresses:** Features #2–#5, #12, #14–#15, #17, #19, #23–#24.  
**Avoids:** Pitfalls 3 (stub commercial), platform-thin settings, footer-only flows, real checkout.  
**Research flag:** Standard — bar is explicit; no deep research unless webhook/HMAC edge cases.

### Phase 5: Sustain bar
**Rationale:** Lab finish gates are mechanical and non-optional: live build, app-up, README screenshots, try.html, tutor guide, scorecard.  
**Delivers:** `try.html`, in-app guide link, README live PNGs (landing, primary workspace, pricing, demo, onboarding/flows), `next build` + app-up smoke, business scorecard readiness.  
**Addresses:** Features #25–#26; comprehensive exit (≥25 features, ≥11 pages, ≥5 flows).  
**Avoids:** Pitfall 4 (screenshot skip); try.html-only captures; finish without live app.  
**Research flag:** None — mechanical gate.

### Phase Ordering Rationale

- **Honesty before claim:** Soft-sim fence and brand smoke prevent overclaim and clone landings.
- **Math before chrome:** Dual scorers + goldens + aggregates precede domain UI so pages cannot ship empty A/B.
- **Derived chain:** accounts/commits → imports → coverage/gaps → renewals/compare (architecture data flow).
- **Commercial after domain pages exist:** Flows/demo CTAs must hit real routes (FEATURES dependency note).
- **Sustain last:** Screenshots and app-up prove the running product, not fixtures alone.
- **Pitfall avoidance:** Clone/IA uniqueness and A/B falsifiability concentrated in Phase 2 research; commercial/screenshot gates in Phases 4–5.

### Research Flags

Phases likely needing deeper research during planning (`/gsd-plan-phase --research`):
- **Phase 2:** A/B formula falsifiability; coverage vs utilization dollarization; multi-cloud normalized import schema; matching policy (family/window); IA uniqueness review vs Idle Seat / True Up
- **Phase 3 (conditional):** Only if Phase 2 matching rules force UI/IA changes

Phases with standard patterns (skip research-phase):
- **Phase 1:** Landing + honesty — established lab soft-sim pattern
- **Phase 4:** Commercial + platform must-haves — COMPREHENSIVE_PRODUCT explicit
- **Phase 5:** Screenshot/app-up sustain — mechanical scripts

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | PRODUCT_STACK + CONTROLLER defaults; versions MEDIUM (npm snapshot 2026-08-07) |
| Features | HIGH | Lab bar + depth pack; market table stakes MEDIUM |
| Architecture | HIGH | ERD + blueprint + Spend Cap sibling; exact match algorithm LOW→phase |
| Pitfalls | HIGH | Lab clone/honesty/gates; FinOps metric nuance MEDIUM |

**Overall confidence:** HIGH

### Gaps to Address

- **Exact match algorithm (family/hour/$ attribution):** LOW confidence in architecture research — resolve in Phase 2 plan-phase research before locking goldens.
- **Multicloud instrument normalization:** Keep provider-specific types; rollup dimensions only — validate schema in Phase 2.
- **Windows better-sqlite3 native build:** Fallback to `node:sqlite` DatabaseSync if agent env lacks toolchain — do not switch to Postgres.
- **Vitest vs sibling `tsx --test`:** Prefer Vitest to match CONTROLLER; either allowed under PRODUCT_STACK.
- **v1.x extras (forecast, heatmaps, live connectors):** Explicitly out of sustain scope until buyers use renewal packs.

## Sources

### Primary (HIGH confidence)
- `docs/PRODUCT_STACK.md`, `matrix/CONTROLLER.json` product_defaults
- `docs/COMPREHENSIVE_PRODUCT.md`, `.planning/PROJECT.md`
- `docs/ideas/commitment-coverage-studio-{COMPREHENSIVE-BLUEPRINT,ERD,API-CONTRACT,PAGE-SPECS,PHASE-BRIEFS,DESIGN,PM-GO,KILL-ROUNDS,VISION}.md`
- Sibling studios: `projects/spend-cap-studio`, `idle-seat-studio`, `true-up-studio` (scaffold + anti-clone)

### Secondary (MEDIUM confidence)
- FinOps Foundation commitment-discount / purchasing guidance
- Cloudaware commitments & reservations docs; Usage AI Savings Plan KPI practice
- Context7 `/vercel/next.js` App Router defaults
- `npm view` registry pins 2026-08-07

### Tertiary (LOW confidence)
- Exact multi-cloud matching formulas (defer to Phase 2 research)
- Twin-equivalence harness literature (intentionally **not** this product’s compare claim)

---
*Research completed: 2026-08-07*
*Ready for roadmap: yes*
