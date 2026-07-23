# Comprehensive product bar (method lab)

Human steer (2026-07-23): ship **mature, sophisticated products** — not coded-name calculator costumes. See `docs/PRODUCT_NAMING.md`.

This does **not** waive `protocols/IDEA_DEPTH.md`. It raises what “ready_to_build → sustain” must look like.

## Hard minimums (every new product)

| Area | Minimum |
|------|---------|
| **Display name** | Mature human name per `docs/PRODUCT_NAMING.md` (not a statute code or glue-noun) |
| **Unique domain claim** | Cleared IDEA_DEPTH; non-isomorphic; money honesty in digests |
| **Resources** | ≥4 durable aggregates (not one table + status) |
| **UI** | ≥6 distinct pages/views (not one form); **Next.js + Tailwind + shadcn** (`docs/PRODUCT_STACK.md`); Python sidecar OK when the paper claim needs it |
| **Design** | Product designer note `docs/ideas/<slug>-DESIGN.md` (`protocols/DESIGN.md`) before sustain |
| **Features** | **≥15** user-visible capabilities (see feature menu below) — CRUD alone does not count toward 15 |
| **API** | Auth + multi-tenant org + pagination + idempotent webhook + export |
| **Tests** | Depth suite for unique claim (≥25) **plus** UI critical path for every page |
| **Guides** | Best-practices tutor writes ≥1 guide under `docs/guides/` before sustain email |
| **Try artifact** | Offline `try.html` demos core claim; product remains multi-page |
| **Scoring** | Phase cells scored with maturity rubric (`docs/RUBRIC.md`) — not pass-count theater |

## Feature menu (pick ≥15 distinct, user-visible)

Examples that count (each once): domain forecast/calc, scenario compare, history timeline, audit log, CSV/JSON export, search, filters, saved views, role-based screens, org settings, member invite, webhook config, notification of rejects, batch jobs, concurrency-safe batch, pagination, goldens browser, honesty/disclaimer surface, report summary, import, idempotent inbound events, rate-limit feedback, dual-impl verify panel, onboarding checklist, help/guide link in-app.

CRUD create/read/update alone = **3 max** toward the 15. Dual-approval status boards do **not** count as domain features.

## Explicit fails (instant shallow)

- Ugly acronym / statute-code product brand
- One calculator page + dual approval
- Noun-swap of a prior sustained product
- Sustain with <6 pages, <4 aggregates, or <15 features
- Pass-count digests without story + money honesty
- Shipping without a tutor guide for what was learned

## Relationship to depth restart

Fewer products. Slower research. When we **do** build, build **comprehensive and mature** — one deep product beats ten isomorphic smokes.

## Role pack required before `projects/<slug>/`

Drive work through `protocols/AGENT_ROLES.md` (researcher → product manager → senior architect → **product designer** → product delivery → best-practices tutor).

After `ready_to_build`, product manager commits roadmap + go, then senior architect + designer commit the pack **before** opening the product folder (paper pick→build may open smoke first, then design + Next climb):

| Artifact | Path |
|----------|------|
| PM go | `docs/ideas/<slug>-PM-GO.md` |
| Vision | `docs/ideas/<slug>-VISION.md` |
| Roadmap | `docs/ideas/<slug>-ROADMAP.md` |
| PRD | `docs/ideas/<slug>-PRD.md` |
| ERD | `docs/ideas/<slug>-ERD.md` |
| Blueprint | `docs/ideas/<slug>-COMPREHENSIVE-BLUEPRINT.md` (page map, **≥15-feature** matrix, aggregates, test themes) |
| Design | `docs/ideas/<slug>-DESIGN.md` (brand, tokens, page compositions, shadcn theme) |

Shallow “blueprint = phase rename of dual-gate smoke” fails this bar.

## UI never broken

Sustain (and each phase that unlocks a page) requires an automated **UI critical path** — not API-only green. A single calculator HTML shell fails sustain even with ≥25 goldens. New products ship real pages on **Next.js + Tailwind + shadcn**; offline `try.html` stays the digest demo only.
