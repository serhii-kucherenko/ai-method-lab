# Papers intake — depth then one product

Human steer (2026-07-23): **stop isomorphic desk churn**. A paper is research input for a real business product — not a same-tick smoke scaffold.

## Rule

When digests are available and the lab is idle (no `current_product`) **and** CONTROLLER is not `paused`:

1. Shortlist papers (`node scripts/pick-paper-idea.mjs --days 14 --write-shortlist`) — **do not** `--choose` until depth clears
2. Researcher writes idea dossier + unique claim (not dual-gate costume)
3. PM writes buyer, outcome, selling points, roadmap, **PM-GO**
4. Architect + designer commit Vision / PRD / ERD / blueprint / DESIGN
5. Only then open `projects/<slug>/` and climb
6. Ship a **comprehensive** product (`docs/COMPREHENSIVE_PRODUCT.md`) — README + guide + try + live app gate
7. Email **product finished** only when the product is genuinely distinct — TLDR first + Sources (`protocols/NOTIFY.md`)
8. Run **garbage collector**: score the product into `matrix/business-scores.json`, regenerate scorecard, kill/park weak backlog ideas (`protocols/GARBAGE_COLLECTOR.md`)
9. Clear slot → next pick only from ideas that would score **A/B** under `docs/BUSINESS_RUBRIC.md`

Never invent freehand statute-code seeds while simple-papers digests exist.
Never noun-swap a prior desk with a new scoring function.

## Business score gate

Before `--choose` / opening `projects/<slug>/`:

1. Draft buyer, money hook, PMF signal (even if early)
2. Score with `docs/BUSINESS_RUBRIC.md`
3. **Abort** if tier **Kill** or **C** (finish in-flight only; do not start new C/Kill)
4. Upsert row: `node scripts/score-business.mjs --write-md` after editing `matrix/business-scores.json`

Scorecard: `matrix/BUSINESS_SCORECARD.md`

## Eligibility

Same contract as simple-papers [`docs/METHOD_LAB_INTAKE.md`](https://github.com/serhii-kucherenko/simple-papers/blob/main/docs/METHOD_LAB_INTAKE.md):

- `code.url`, **or**
- `cs.*` + software tags + non-empty `impact.forTech`

Refuse wet-lab-only without code. Refuse clones of Filing Penalty Desk (late tax additions). Prefer papers with public code and a clear buyer story.

## Naming

Mature display name (2–4 English words). Slug = hyphenated lowercase. Never brand with arXiv ids or statute codes. Prefer names that sound like products people buy — not “X Desk” by default.

## Artifacts every product must ship

| Artifact | Path |
|----------|------|
| PM pack | `docs/ideas/<slug>-{PM-GO,VISION,ROADMAP,PRD,ERD,COMPREHENSIVE-BLUEPRINT}.md` |
| Design note | `docs/ideas/<slug>-DESIGN.md` (includes landing brief) |
| README | `projects/<slug>/README.md` |
| Marketing landing | `/` — selling points, features, explanations (`protocols/DESIGN.md`) |
| App stack | Next.js + Tailwind + shadcn; Python sidecar when needed (`docs/PRODUCT_STACK.md`) |
| Tutor guide | `docs/guides/NN-<slug>-lessons.md` |
| Offline try | `projects/<slug>/try.html` |
| Live app smoke | `projects/<slug>/test/app-up.test.ts` |

## Forbidden

- Hourly/10-minute pick→clone→email loops
- Template desks: identical `/jobs` `/lifecycle` `/scenario` `/batch` `/audit` `/goldens` shells with a renamed domain module
- Finish emails for shallow smokes
