# Papers intake — depth then one product

Human steer (2026-07-23): **stop isomorphic desk churn**. A paper is research input for a real business product — not a same-tick smoke scaffold.

Human steer (2026-07-26): **business ideas software can fix** — not devices, healthcare carepaths, wet-lab biologics, or retail/consumer novelty. Papers still feed research; they do **not** entitle a climb unless the problem is a software product a buyer would pay for.

## Rule

When digests are available and the lab is idle (no `current_product`) **and** CONTROLLER is not `paused`:

1. Shortlist papers (`node scripts/pick-paper-idea.mjs --days 14 --write-shortlist`) — picker refuses device/clinical/wet-lab/retail costumes
2. Researcher writes idea dossier + unique claim (not dual-gate costume) — **job-to-be-done first**, paper second
3. PM writes buyer, outcome, selling points, roadmap, **PM-GO** — abort if not software-solvable
4. Architect + designer commit Vision / PRD / ERD / blueprint / DESIGN
5. Only then open `projects/<slug>/` and climb
6. Ship a **comprehensive** product (`docs/COMPREHENSIVE_PRODUCT.md`) — README + guide + try + live app gate
7. Email **product finished** only when the product is genuinely distinct — TLDR first + Sources (`protocols/NOTIFY.md`)
8. Run **garbage collector**: score the product into `matrix/business-scores.json`, regenerate scorecard, kill/park weak backlog ideas (`protocols/GARBAGE_COLLECTOR.md`)
9. Clear slot → next pick only from ideas that would score **A/B** under `docs/BUSINESS_RUBRIC.md` (**biz-rubric-v2+**)

Never invent freehand statute-code seeds while simple-papers digests exist.
Local Method Lab handoff digests may also live at `docs/ideas/_paper-picks/digests/` — the picker merges them when present (bridge into simple-papers via `SIMPLE_PAPERS_HANDOFF.md`).
Never noun-swap a prior desk with a new scoring function.
**Idea-first allowed** when a software business wedge is clearer without a fresh paper (e.g. rubric/scoring studio from `docs/RESEARCH.md`) — still requires full depth pack + A/B score.

## Business score gate

Before `--choose` / opening `projects/<slug>/`:

1. Draft buyer, money hook, PMF signal (even if early)
2. Ask: **can software engineering alone fix this for the buyer?** If no → Kill
3. Score with `docs/BUSINESS_RUBRIC.md` (current version)
4. **Abort** if tier **Kill** or **C** (do not start; abandon in-flight when human steers category kill)
5. Upsert row: `node scripts/score-business.mjs --write-md` after editing `matrix/business-scores.json`

Scorecard: `matrix/BUSINESS_SCORECARD.md`

## Eligibility

Same contract as simple-papers [`docs/METHOD_LAB_INTAKE.md`](https://github.com/serhii-kucherenko/simple-papers/blob/main/docs/METHOD_LAB_INTAKE.md), **plus** software-solvable filter:

- `code.url`, **or**
- `cs.*` + software tags + non-empty `impact.forTech`

**Refuse (even with code):**
- Medical devices / live clinical / FDA / CDS / EMR write-back primary claims
- Wet-lab / biologics / assay / conjugate / imaging-diagnostic soft-sims as the product
- Consumer packing / itinerary / retail shopper novelty without B2B money
- Clones of Filing Penalty Desk (late tax additions)

Prefer: FinOps, trust/eval, OT/ICS software, ML/dev infra, literal-dollar compliance, rubric/scoring quality. Prefer public code and a clear buyer story.

## Naming

Mature display name (2–4 English words). Slug = hyphenated lowercase. Never brand with arXiv ids or statute codes. Prefer names that sound like products people buy — not “X Desk” by default.

## Artifacts every product must ship

| Artifact | Path |
|----------|------|
| PM pack | `docs/ideas/<slug>-{PM-GO,VISION,ROADMAP,PRD,ERD,COMPREHENSIVE-BLUEPRINT}.md` |
| Design note | `docs/ideas/<slug>-DESIGN.md` (includes landing brief) |
| README | `projects/<slug>/README.md` |
| Marketing landing | `/` — selling points, features, explanations (`protocols/DESIGN.md`) |
| Pricing + tiers | `/pricing` — hypothetical plans/tiers aligned to money hook |
| Step-by-step demo | `/demo` — guided in-app walkthrough of the core happy path |
| Onboarding checklist | `/onboarding` — first-run checklist with visible progress |
| Multi-flow index | `/flows` (or equiv.) — ≥5 named sophisticated user journeys with entry CTAs |
| Platform must-haves | Category-standard surfaces (audit, export, orgs, search, webhooks, goldens, SLA, glossary, …) per `docs/COMPREHENSIVE_PRODUCT.md` |
| App stack | Next.js + Tailwind + shadcn; Python sidecar when needed (`docs/PRODUCT_STACK.md`) |
| Tutor guide | `docs/guides/NN-<slug>-lessons.md` |
| Offline try | `projects/<slug>/try.html` |
| Live app smoke | `projects/<slug>/test/app-up.test.ts` |

## Forbidden

- Hourly/10-minute pick→clone→email loops
- Template desks: identical `/jobs` `/lifecycle` `/scenario` `/batch` `/audit` `/goldens` shells with a renamed domain module
- Finish emails for shallow smokes
