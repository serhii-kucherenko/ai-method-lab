# Agent roles (product pipeline)

Human steer (2026-07-21): one undifferentiated agent kept shipping shallow one-page products.  
**Drive every product through three roles.** Scripted handoffs are fine; skipping a role is not.

| Role | Owns | Does not own |
|------|------|----------------|
| **Researcher** | Idea depth, kill rounds, value honesty, fixtures that teach | Product folders, “ready because fixtures are green” |
| **Senior architect / engineer** | Vision, roadmap, PRD, ERD/contracts, comprehensive blueprint, phase briefs | Shipping UI without contracts; noun-swap scaffolds |
| **Product delivery** | Phased build RED→GREEN, UI never broken, try artifact, sustain exit | Inventing scope; flipping ready_to_build |

## Handoff order (mandatory)

```text
Researcher (IDEA_DEPTH → ready_to_build)
    → Senior architect (VISION + ROADMAP + PRD + ERD + blueprint)
        → Product delivery (phases under projects/<id>/)
```

No `projects/<id>/` until:

1. Researcher cleared `protocols/IDEA_DEPTH.md` → `ready_to_build` (and calendar / value gates)
2. Senior architect committed paper pack under `docs/ideas/`:

| Artifact | File |
|----------|------|
| Vision | `<id>-VISION.md` |
| Roadmap | `<id>-ROADMAP.md` |
| PRD | `<id>-PRD.md` |
| ERD | `<id>-ERD.md` |
| Blueprint | `<id>-COMPREHENSIVE-BLUEPRINT.md` (≥4 pages, ≥3 aggregates, ≥6 features) |
| Page specs + phase briefs | `<id>-PAGE-SPECS.md`, `<id>-PHASE-BRIEFS.md` |
| API contract | `<id>-API-CONTRACT.md` |

3. Pack matches `docs/COMPREHENSIVE_PRODUCT.md` — not a calculator costume

## Researcher

Follow `protocols/IDEA_DEPTH.md`. Optimize for **kill early** and **money honesty**.  
Paper goldens may exist; they never substitute for G1–G6 or Challenge D value.

**Exit:** skeptical G6 summary + explicit `ready_to_build` **or** park/kill with autopsy.

## Senior architect / engineer

Turn a cleared idea into a **buildable sophisticated product**, not a smoke brief.

| Deliverable | Bar |
|-------------|-----|
| **VISION** | Who, 12-month success, what we refuse to become |
| **ROADMAP** | smoke→crud→workflow→integrate→scale→sustain with page unlocks + exit criteria |
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

**Exit:** scored phase + FINDINGS; try.html + StackBlitz on product finished.

## Parallelism

- One **depth keep-going loop** (see `docs/ideas/LOOP_DISCIPLINE.md`)
- Parallel **role agents/tasks** OK (researcher deepening seed B while architect papers seed A — only one `current_idea` / one product phase in CONTROLLER)
- Never two product folders in flight (`depth_policy.max_active_products`)

## Anti-patterns

- Collapsing all three roles into “agent wrote fixtures then opened projects/”
- PRD that is only a phase-brief rename of dual-gate smoke
- ERD that invents routes contradicting the API contract
- Sustaining on API ladder + one HTML shell
- Same-day researcher flip + architect pack + delivery smoke (research theater)

## Controller wiring

- Research ticks → Researcher
- After `ready_to_build`, before `projects/` → Senior architect (may span multiple ticks)
- `phase: running` → Product delivery
- Role log optional in `projects/<id>/ROLE_LOG.md` during build
