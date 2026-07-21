# Comprehensive product bar (method lab)

Human steer (2026-07-21): products used to test the workflow must be **big and comprehensive** — multi-page, multi-feature — not single-route dual-gate smokes.

This does **not** waive `protocols/IDEA_DEPTH.md`. It raises what “ready_to_build → sustain” must look like.

## Hard minimums (every new product)

| Area | Minimum |
|------|---------|
| **Unique domain claim** | Cleared IDEA_DEPTH; non-isomorphic; money honesty in digests |
| **Resources** | ≥3 durable aggregates (not just one table + status) |
| **UI** | ≥4 distinct pages/views (not one form) |
| **Features** | ≥6 user-visible capabilities beyond CRUD (classify/calc, history, audit, search/filter, roles, export or report, webhook/inbound event, settings or org admin) |
| **API** | Auth + multi-tenant org + pagination + idempotent webhook |
| **Tests** | Depth suite for unique claim (≥25) **plus** UI/API integration coverage for each page’s critical path |
| **Try artifact** | Offline `try.html` demos core claim; product itself remains multi-page |

## Explicit fails (instant shallow)

- One calculator page + dual approval
- Noun-swap of a prior sustained product
- “Sustain” with <4 pages or <3 aggregates
- Pass-count digests without story + money honesty

## Relationship to depth restart

Fewer products. Slower research. When we **do** build, build **comprehensive** — one deep product beats ten isomorphic smokes.

## Blueprint required before `projects/<id>/`

Write `docs/ideas/<id>-COMPREHENSIVE-BLUEPRINT.md` with page map, feature matrix, aggregates, and test themes **before** opening the product folder (after ready_to_build).
