# Agent roles (product pipeline)

Human steer (2026-07-23): ugly coded names and shallow scaffolds failed.  
**Drive every product through five roles.** Scripted handoffs are fine; skipping a role is not.

| Role | Owns | Does not own |
|------|------|----------------|
| **Researcher** | Idea depth, kill rounds, value honesty, fixtures that teach; **mature display name** | Product folders; “ready because fixtures are green” |
| **Product manager** | Problem framing, prioritized roadmap, phase exits, go/no-go, findings email gate | Production code; inventing domain math |
| **Senior architect / engineer** | Vision, engineering roadmap, PRD, ERD/contracts, **≥15-feature** blueprint | Shipping UI without contracts; noun-swap scaffolds |
| **Product delivery** | Phased build RED→GREEN, UI never broken, try artifact, sustain | Inventing scope; starting the next product early |
| **Best-practices tutor** | Guides under `docs/guides/` from what we just learned; scoring notes that teach | Inventing new product scope; skipping research |

## Handoff order (mandatory)

```text
Researcher (IDEA_DEPTH → ready_to_build + mature name)
    → Product manager (roadmap + go/no-go)
        → Senior architect (VISION + ROADMAP + PRD + ERD + ≥15-feature blueprint)
            → Product delivery (phases under projects/<slug>/)
                → Best-practices tutor (guide + scoring note)
                    → Product manager (findings email) → only then next idea
```

Naming: `docs/PRODUCT_NAMING.md`. Folder slug = pronounceable words. Display name appears in UI, digests, portfolio.

No `projects/<slug>/` until:

1. Researcher cleared `protocols/IDEA_DEPTH.md` → `ready_to_build`
2. Product manager signed roadmap + `PM-GO.md` with `decision: go`
3. Senior architect committed paper pack under `docs/ideas/`:

| Artifact | File |
|----------|------|
| Vision | `<slug>-VISION.md` |
| Roadmap | `<slug>-ROADMAP.md` |
| PRD | `<slug>-PRD.md` |
| ERD | `<slug>-ERD.md` |
| Blueprint | `<slug>-COMPREHENSIVE-BLUEPRINT.md` (≥6 pages, ≥4 aggregates, **≥15 features**) |
| Page specs + phase briefs | `<slug>-PAGE-SPECS.md`, `<slug>-PHASE-BRIEFS.md` |
| API contract | `<slug>-API-CONTRACT.md` |
| PM go/no-go | `<slug>-PM-GO.md` |

4. Pack matches `docs/COMPREHENSIVE_PRODUCT.md`

## Researcher

Follow `protocols/IDEA_DEPTH.md` + `docs/PRODUCT_NAMING.md`. Kill early. Money honesty.  
**Exit:** skeptical G6 + `ready_to_build` **or** park/kill — always with a mature display name.

## Product manager

Templates: `docs/ideas/PM_INTAKE_CHECKLIST.md`, `docs/ideas/PM_ROADMAP_TEMPLATE.md`.

| Deliverable | Bar |
|-------------|-----|
| **Roadmap** | Phases with user-visible unlocks + exit criteria **before** RED tests |
| **Go / no-go** | Explicit go only after ready_to_build + roadmap review |
| **Findings gate** | Product-complete email before next product |

## Senior architect / engineer

| Deliverable | Bar |
|-------------|-----|
| **VISION** | Who, 12-month success, what we refuse to become (including “refuse ugly names”) |
| **ROADMAP** | Engineering detail under PM order |
| **PRD** | Personas, stories, AC, out-of-scope |
| **ERD** | ≥4 aggregates; auth boundaries |
| **Blueprint** | **≥15** user-visible features mapped to pages |

## Product delivery

Follow `protocols/PRODUCT_RUNBOOK.md` + `docs/DEVELOPMENT_WORKFLOW.md`.

### UI never broken (hard)

1. RED→GREEN (no weaken-to-pass)
2. UI critical path per unlocked page
3. Sustain: ≥6 views, ≥15 features live, mature display name in UI chrome

**Exit:** scored phase + FINDINGS → tutor guide → PM findings email. No next product until email sent.

## Best-practices tutor

After each sustained product (and after meaningful research kills), write a **plain-language guide** that a future agent or human can follow.

| Deliverable | Path |
|-------------|------|
| Guide | `docs/guides/<nn>-<slug-or-topic>.md` |
| Index row | `docs/guides/README.md` |
| Scoring note | Optional `docs/guides/scoring/<slug>.md` — what the rubric should reward next time |

Guides explain **how we built / verified / what failed**, not acronym laundry lists. No statute-code brand in the title if a display name exists.

**Exit:** guide committed before product-complete email when a product finished; for research-only kills, guide optional but preferred.

## Parallelism

- One keep-going loop (`docs/ideas/LOOP_DISCIPLINE.md`)
- ≤20 parallel agents; one `current_idea` / one product phase in CONTROLLER
- Tutor may write guides while researcher deepens the *next* named idea (docs only)
- Never two product folders; never switch products before findings email

## Anti-patterns

- `c1592` / `irc6651` / `oshamult`-style brands as the product people see
- Collapsing roles into “fixtures then projects/”
- <15 features called “comprehensive”
- Skipping the tutor guide
- Starting the next product because smoke was green

## Controller wiring

- Research → Researcher  
- ready_to_build → Product manager → Senior architect  
- `phase: running` → Product delivery  
- Sustain scored → Best-practices tutor → Product manager email → research next idea
