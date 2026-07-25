# PRD — Sign Stream Studio

## Problem
Language-access teams often only have offline batch gloss pipelines. Real-time sentence streams need latency budgets, boundary honesty, and a fair compare against batch quality — or institutions ship “wait until done” as if it were accessibility.

## Buyer / users
- **Buyer:** A11y / language-access product lead (institution seats + stream minutes)
- **Users:** Product ops, interpreters’ program staff, localization eng reviewing soft-sim quality

## Goals
1. Manage sign streams and sentence segments
2. Set and respect latency budgets with visible honesty
3. Curate glossary coverage affecting stream quality
4. Compare real-time stream (A) vs offline-batch (B)
5. Ship commercial surfaces: pricing, guided demo, onboarding checklist

## Non-goals
- Desk shell noun-swap (`/jobs` `/lifecycle` `/scenario` `/batch` `/goldens`)
- Live interpreter certification or clinical ASL adjudication
- Cloning Tactile Chart chart IA or Hold Match matching shells
- Claiming authors’ code or production SLT accuracy

## Dual score
| Impl | Meaning |
|------|---------|
| **A** | Real-time sentence stream quality (latency-in-budget, boundary confidence, continuity) |
| **B** | Offline-batch baseline (full-sequence gloss accuracy, ignores stream pressure) |

## Acceptance (sustain)
- ≥11 pages including `/` `/pricing` `/demo` `/onboarding` `/flows` `/honesty`
- ≥5 named end-to-end user flows (documented in blueprint + shipped on `/flows`)
- ≥25 user-visible features
- A11y category platform must-haves: glossary, latency budgets, export, org/settings, search/filter, audit, dual compare, honesty + keyboard/contrast notes
- ≥30 dual goldens; UI critical path; live app-up
- Honesty fence visible; method-lab packaging on pricing

## Named user flows (≥5)
See blueprint + in-app `/flows`. Minimum set: first-run onboarding; stream→segment→score; realtime vs offline-batch compare; glossary curator; latency/SLA review; audit+export; invite/org; pricing-tier selection.
