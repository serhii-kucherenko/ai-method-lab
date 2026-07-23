# Agent roles (product pipeline)

Human steer (2026-07-22): shallow conveyor products failed the lab goal.  
**Drive every product through four roles.** Scripted handoffs are fine; skipping a role is not.

| Role | Owns | Does not own |
|------|------|----------------|
| **Researcher** | Idea depth, kill rounds, value honesty, fixtures that teach | Product folders, “ready because fixtures are green” |
| **Product manager** | Problem framing for users, prioritized roadmap, phase exit criteria, go/no-go before build, findings digest gate | Writing production code; inventing domain math |
| **Senior architect / engineer** | Vision, roadmap engineering detail, PRD, ERD/contracts, comprehensive blueprint, phase briefs | Shipping UI without contracts; noun-swap scaffolds |
| **Product delivery** | Phased build RED→GREEN, UI never broken, try artifact, sustain exit | Inventing scope; flipping ready_to_build; starting the next product early |

## Handoff order (mandatory)

```text
Researcher (IDEA_DEPTH → ready_to_build)
    → Product manager (roadmap ownership + go/no-go + phase exits)
        → Senior architect (VISION + ROADMAP + PRD + ERD + blueprint)
            → Product delivery (phases under projects/<id>/)
                → Product manager (findings email) → only then next idea/product
```

No `projects/<id>/` until:

1. Researcher cleared `protocols/IDEA_DEPTH.md` → `ready_to_build` (and calendar / value gates)
2. **Product manager** signed a **roadmap** with ordered phases, exit criteria, and an explicit **go** (not “fixtures green”)
3. Senior architect committed paper pack under `docs/ideas/`:

| Artifact | File |
|----------|------|
| Vision | `<id>-VISION.md` |
| Roadmap | `<id>-ROADMAP.md` (PM-owned; architect fills engineering detail) |
| PRD | `<id>-PRD.md` |
| ERD | `<id>-ERD.md` |
| Blueprint | `<id>-COMPREHENSIVE-BLUEPRINT.md` (≥4 pages, ≥3 aggregates, ≥6 features) |
| Page specs + phase briefs | `<id>-PAGE-SPECS.md`, `<id>-PHASE-BRIEFS.md` |
| API contract | `<id>-API-CONTRACT.md` |
| PM go/no-go | `<id>-PM-GO.md` |

4. Pack matches `docs/COMPREHENSIVE_PRODUCT.md` — not a calculator costume

## Researcher

Follow `protocols/IDEA_DEPTH.md`. Optimize for **kill early** and **money honesty**.  
Paper goldens may exist; they never substitute for G1–G6 or Challenge D value.

**Exit:** skeptical G6 summary + explicit `ready_to_build` **or** park/kill with autopsy.

## Product manager

Owns whether we should build, what ships in which order, and when the product is **done enough** to email and leave.

| Deliverable | Bar |
|-------------|-----|
| **Roadmap** | Ordered phases (smoke→crud→workflow→integrate→scale→sustain) with user-visible unlocks and **testable exit criteria** — written **before** RED tests or `projects/` |
| **Priorities** | What is in-phase vs deferred; what would make us abandon mid-build |
| **Go / no-go** | Explicit `go` only after Researcher `ready_to_build` **and** roadmap review; `no-go` parks the idea |
| **Findings gate** | Product finished email (`protocols/NOTIFY.md`) must ship **before** CONTROLLER may switch `current_product` / queue the next build |

**Exit:** committed roadmap + `PM-GO.md` with `decision: go` **or** park with reason. After sustain: findings digest sent; only then release the slot.

## Senior architect / engineer

Turn a cleared, PM-approved idea into a **buildable sophisticated product**, not a smoke brief.

| Deliverable | Bar |
|-------------|-----|
| **VISION** | Who, 12-month success, what we refuse to become |
| **ROADMAP** | Engineering detail under PM phase order: page unlocks + exit criteria |
| **PRD** | Personas, stories, testable AC, out-of-scope |
| **ERD** | Aggregates, fields, relationships, auth boundaries — aligns with API contract |
| **Blueprint** | Multi-page / multi-feature map per comprehensive bar |

**Exit:** paper pack reviewable by a skeptical senior; contracts frozen before RED tests.

## Product delivery

Follow `protocols/PRODUCT_RUNBOOK.md` + `docs/DEVELOPMENT_WORKFLOW.md` (A03 + A10).

### UI never broken (hard)

Do **not** exit a product phase until:

1. **RED→GREEN** — failing tests for the slice exist first; then green (no weaken-to-pass)
2. **UI critical path** — automated check that each blueprint page/view for this phase **loads** and completes its **primary user action** (browser E2E **or** HTML+interaction smoke). API-only suites do **not** clear UI
3. **Comprehensive shape** — sustain requires ≥4 distinct views; a single `public/index.html` calculator **fails** sustain even if API goldens are green

Prefer Playwright (or equivalent) for multi-page products; React Testing Library when the UI is a component library. Document the chosen harness in PRODUCT.md.

**Exit:** scored phase + FINDINGS. On product finished: try.html + StackBlitz, then hand to **Product manager** for the findings email. **Do not** open the next product folder until that email is sent.

## Parallelism

- One **depth keep-going loop** (see `docs/ideas/LOOP_DISCIPLINE.md`)
- Parallel **role agents/tasks** OK — cap **≤20** concurrent agents; CONTROLLER still holds one `current_idea` / one product phase
- Researcher may deepen the **next** seed while delivery finishes the current product — still **no** second `projects/` folder
- Never two product folders in flight (`depth_policy.max_active_products`)
- **Never** switch `current_product` until product-complete notify has been sent (or abandon autopsy emailed)

## Anti-patterns

- Collapsing roles into “agent wrote fixtures then opened projects/”
- Building or testing before a PM roadmap + go
- PRD that is only a phase-brief rename of dual-gate smoke
- ERD that invents routes contradicting the API contract
- Sustaining on API ladder + one HTML shell
- Same-day researcher flip + architect pack + delivery smoke (research theater)
- Starting the next product because smoke was green — without sustain + findings email

## Controller wiring

- Research ticks → Researcher
- After `ready_to_build`, before architect pack → **Product manager** (roadmap + go/no-go)
- After PM go, before `projects/` → Senior architect
- `phase: running` → Product delivery
- Product finished → Product manager findings email → then research / next idea
- Role log optional in `projects/<id>/ROLE_LOG.md` during build
