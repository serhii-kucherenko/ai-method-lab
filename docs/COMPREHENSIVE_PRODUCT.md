# Comprehensive product bar (method lab)

Human steer (2026-07-23): ship **mature, sophisticated products** — not coded-name calculator costumes. See `docs/PRODUCT_NAMING.md`.

This does **not** waive `protocols/IDEA_DEPTH.md`. It raises what “ready_to_build → sustain” must look like.

## Hard minimums (every new product)

| Area | Minimum |
|------|---------|
| **Display name** | Mature human name per `docs/PRODUCT_NAMING.md` (not a statute code or glue-noun) |
| **Unique domain claim** | Cleared IDEA_DEPTH; non-isomorphic; money honesty in digests |
| **Resources** | ≥4 durable aggregates (not one table + status) |
| **UI** | ≥11 distinct pages/views including a **marketing landing at `/`** plus **required commercial/onboarding surfaces** below; **Next.js + Tailwind + shadcn** (`docs/PRODUCT_STACK.md`); Python sidecar OK when the paper claim needs it; prefer multiple product lines / role surfaces when the claim supports them |
| **Pricing** | Dedicated **`/pricing`** — hypothetical plans/tiers aligned to the money hook (seats / usage / site license); what each tier includes; honesty that this is method-lab packaging, not a live checkout |
| **Step-by-step demo** | Dedicated **`/demo`** — guided walkthrough of the core happy path (numbered steps a stranger can complete in-app); not a substitute for `try.html` |
| **User flows** | **≥5** named, sophisticated end-to-end flows (not one happy path). Each flow names actor, job-to-be-done, pages touched, success criteria, and empty/error paths. Ship in-app (e.g. `/flows` index + runnable journeys) and document in PRD/blueprint |
| **Platform must-haves** | Beyond the paper claim: the **category-standard** surfaces for this kind of product (eval bench vs ops console vs a11y platform vs industrial design tool, etc.) — orgs/roles, audit, search, export, webhooks, notifications, settings — implemented for real, not footer links |
| **Platform best practices** | Category-specific best practices (examples: a11y → keyboard/contrast honesty; eval → goldens + leaderboard + dual compare; ops → audit trail + SLA/latency budgets; industrial design → versioned packs + export). Tutor guide must call out which practices shipped |
| **Design** | Product designer note `docs/ideas/<slug>-DESIGN.md` (`protocols/DESIGN.md`) before sustain — must include landing brief |
| **Features** | **≥25** user-visible capabilities (see feature menu below) — CRUD alone does not count toward 25; multi-flow depth over single-path theater |
| **API** | Auth + multi-tenant org + pagination + idempotent webhook + export |
| **Tests** | Depth suite for unique claim (≥25) **plus** UI critical path for every page |
| **Guides** | Best-practices tutor writes ≥1 guide under `docs/guides/` before sustain email |
| **Try artifact** | Offline `try.html` demos core claim; product remains multi-page |
| **README screenshots** | Real PNGs of the live platform UI under `projects/<slug>/screenshots/`, embedded in `README.md` (landing, primary workspace, `/pricing`, `/demo`, plus `/onboarding` or `/flows`) — capture via `scripts/capture-product-screenshots.mjs`; not mocks, not `try.html`-only |
| **Live app** | **`npm run build` green** and a **live smoke** that starts the finished app (`next start` or `npm run start`) and HTTP-gets `/` (and preferably `/jobs`) asserting the display name and honesty fence — unit/API green alone is **not** enough |
| **Scoring** | Phase cells scored with maturity rubric (`docs/RUBRIC.md`) — not pass-count theater |

## Feature menu (pick ≥25 distinct, user-visible)

**Required (count toward ≥25; each must ship as a real page or interactive surface):** marketing landing `/`, **`/pricing` (plans + tiers)**, **`/demo` (step-by-step guided demo)**, **`/onboarding` (checklist with visible progress)**, honesty/disclaimer, **multi-flow index** (`/flows` or equivalent) covering ≥5 named journeys.

Examples that also count (each once): domain forecast/calc, scenario compare, history timeline, audit log, CSV/JSON export, search, filters, saved views, role-based screens, org settings, member invite, webhook config, notification of rejects, batch jobs, concurrency-safe batch, pagination, goldens browser, report summary, import, idempotent inbound events, rate-limit feedback, dual-impl verify panel, help/guide link in-app, leaderboard, versioned packs, SLA/latency budget board.

CRUD create/read/update alone = **3 max** toward the 25. Dual-approval status boards do **not** count as domain features. **One** dual-compare path does **not** satisfy the ≥5 flows bar.

## User flows (hard — many, not one)

Every product ships **at least five** comprehensive flows that a stranger can complete. One onboarding path + one compare is **not** enough.

For each flow, blueprint + in-app copy must state:

1. **Actor** — who (role) runs it
2. **Job** — what painful outcome it finishes
3. **Steps** — ordered pages/actions (not a single form)
4. **Success** — what “done” looks like (score, export, ack, invite, etc.)
5. **Failure / empty** — what happens when data or auth is missing

Examples of flow variety (adapt to the product; do not copy blindly): first-run setup, primary domain create→score→compare, batch / scale path, audit & export for a reviewer, invite/org admin, webhook/inbound event, pricing-tier selection → unlock, recovery after reject/fail, accessibility check path, ops SLA review path.

`/demo` may showcase **one** guided path; `/flows` (or nav-equivalent) must list **all** named flows with entry CTAs.

## Platform must-haves & best practices

Do **not** ship only the paper’s algorithm costume. Identify the **product category** (eval / ops / a11y / industrial design / trust / FinOps / …) and ship that category’s table-stakes:

| Category (examples) | Must-haves / practices to include |
|---------------------|-----------------------------------|
| Eval / bench | Goldens, dual compare, leaderboard or scoreboard, case packs, honesty fence |
| Ops / marketplace | Audit trail, latency/SLA budgets, hold/decision history, export, role separation |
| A11y / language access | Onboarding checklist, contrast/keyboard honesty, glossary, stream/segment latency, export |
| Industrial / design tool | Versioned packs, parameter boards, export, compare against baseline, soft-sim honesty |
| Trust / attest | Evidence ledger, proof chain, attest vs fluent compare, audit, org settings |
| Cost / infra | Budgets, plan packs, compile/runtime honesty, compare vs naive baseline, settings |

Tutor guide must list which category practices shipped and which were deferred (with why).

## Explicit fails (instant shallow)

- Ugly acronym / statute-code product brand
- One calculator page + dual approval
- Desk-only UI with **no marketing landing** (no selling points / features / explanations page)
- Noun-swap of a prior sustained product
- **Isomorphic “desk” clones** — same jobs/lifecycle/scenario/batch/audit/goldens shell with a new domain score function and a renamed landing (human steer 2026-07-23 wipe)
- Same-tick paper pick → smoke scaffold → sustain email without PM go, vision, roadmap, PRD, ERD, blueprint, and design pack
- Sustaining with green API tests while `next build` / `next start` is broken (landing 500 / module-not-found)
- Sustain with <11 pages, <4 aggregates, or <25 features
- Missing `/pricing`, `/demo`, or `/onboarding` (or empty stubs with no tiers / steps / checklist)
- Only **one** user journey (single happy path) — fails the ≥5 flows bar
- Paper-claim UI with **no** category platform must-haves (no audit/export/org/search/webhooks/etc. where the category expects them)
- Pass-count digests without story + money honesty
- Shipping without a tutor guide for what was learned
- Sustaining with a README that has **no** live platform screenshots (empty or missing `screenshots/`, or images that are not the product's own UI)

## What “comprehensive” means (non-negotiable)

A paper or document is **research input**, not a product. Before code:

1. **Buyer** — who pays / who uses, in plain language
2. **Outcome** — what job gets done better than today’s messy alternative
3. **Selling points** — 3–7 reasons a stranger would open the app
4. **Feature map** — capabilities that serve that story (not CRUD theater)
5. **Distinct UX** — pages and flows unique to this product; not a renamed prior desk
6. **Many user flows** — ≥5 sophisticated journeys (actors + jobs + success), not a single demo path
7. **Platform fit** — category must-haves and best practices for the kind of product this is

If the product folder could be produced by find-replace on another desk, it fails.

## Relationship to depth restart

Fewer products. Slower research. When we **do** build, build **comprehensive and mature** — one deep product beats ten isomorphic smokes.

## Role pack required before `projects/<slug>/`

Drive work through `protocols/AGENT_ROLES.md` (researcher → product manager → senior architect → **product designer** → product delivery → best-practices tutor).

After `ready_to_build`, product manager commits roadmap + go, then senior architect + designer commit the pack **before** opening the product folder. **No same-tick paper→smoke.** Paper pick enters research; code starts only after the pack below exists:

| Artifact | Path |
|----------|------|
| PM go | `docs/ideas/<slug>-PM-GO.md` |
| Vision | `docs/ideas/<slug>-VISION.md` |
| Roadmap | `docs/ideas/<slug>-ROADMAP.md` |
| PRD | `docs/ideas/<slug>-PRD.md` |
| ERD | `docs/ideas/<slug>-ERD.md` |
| Blueprint | `docs/ideas/<slug>-COMPREHENSIVE-BLUEPRINT.md` (page map, **≥5 named user flows**, **≥20-feature** matrix, platform must-haves, aggregates, test themes) |
| Design | `docs/ideas/<slug>-DESIGN.md` (brand, tokens, page compositions, shadcn theme) |

Shallow “blueprint = phase rename of dual-gate smoke” fails this bar.

## UI never broken

Sustain (and each phase that unlocks a page) requires an automated **UI critical path** — not API-only green. A single calculator HTML shell fails sustain even with ≥25 goldens. New products ship real pages on **Next.js + Tailwind + shadcn**, including a **marketing landing at `/`**, **`/pricing`**, **`/demo`**, **`/onboarding`**, and a **multi-flow index** (`/flows` or equivalent) with ≥5 journeys; offline `try.html` stays the digest demo only. Primary CTA from landing usually enters the domain workspace (not `/jobs` unless that route is domain-native).

**Live app gate (hard):** before sustain email, `npm run build` must pass and a live smoke (`test/app-up.test.ts` or `npm run test:app-up`) must boot the production server and fetch `/` successfully. Copy `templates/product/app-up.test.ts`.
