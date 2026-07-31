# PAGE-SPECS — Contract Rate Variance Studio

Design tokens: `contract-rate-variance-studio-DESIGN.md`. Blueprint: `contract-rate-variance-studio-COMPREHENSIVE-BLUEPRINT.md`.

## Marketing / commercial

| Route | Job | Must show | Must not |
|-------|-----|-----------|----------|
| `/` | Sell $ variance before payment | Brand-first hero; CTA `/catalog` + `/demo` | Stats/cards in first viewport; invented metrics |
| `/pricing` | Seats + variance-run usage | Evaluator / Platform / Site tiers | Real card checkout |
| `/demo` | Guided dual claim | Catalog → invoice → variance → dispute; A vs B | Skip honesty |
| `/onboarding` | Checklist + progress | Visible progress | Empty docs wall |
| `/flows` | ≥5 journeys | Named CTAs | Footer-only |
| `/honesty` | Soft-sim fence | Not AP SOR; not True Up / Commitment Coverage | Fake compliance badges |

## Domain

| Route | Job | Empty / error |
|-------|-----|----------------|
| `/catalog` | Contract SKU CRUD | Import or add first SKU |
| `/invoices` | Invoice batches + lines | Need import |
| `/variances` | Unit-rate $ findings | No mismatches in window |
| `/disputes` | Dispute cases + actions | No open cases |
| `/imports` | Catalog/invoice batches | Failed batch detail |
| `/compare` | A catalog-matched vs B invoice-as-billed | Need both paths |
| `/scoreboard` | Vendor rollups | Empty org |
| `/settings` | Org, members, webhook, export | Validation errors |

## Forbidden IA
`/jobs` `/lifecycle` `/scenario` `/batch` `/goldens` as primary nav.
