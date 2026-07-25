# PRD — Fail Gate Studio

## Problem
Safety QA leads see “accuracy passed” while models still fail medical safety boundaries. Taxonomy and boundary reasons are buried in spreadsheets; release gates lack a dual score that falsifies correctness-only optimism.

## Goals
1. Fail-case registry with severity and searchable metadata
2. Safety-gate taxonomy (gate types + severity bands)
3. Boundary inspection workspace (boundary reason + evidence notes)
4. Dual compare: fail-gate diagnosis (A) vs correctness-only (B)
5. Scoreboard, private case packs, audit, export, org settings
6. Pricing / demo / onboarding / ≥5 named flows / honesty fence

## Non-goals
- Branding as MedFailBench
- Clinical decision support or carepath routing
- Claiming certification or live hospital deployment
- Desk noun-swap IA (`/jobs` `/lifecycle` `/scenario` `/batch` `/goldens`)
- Cloning Consult Bench consult-turn IA

## Dual score
| Lane | Name | Job |
|------|------|-----|
| **A** | Fail-gate taxonomy diagnosis | Severity fit + gate type + boundary reason coherence |
| **B** | Correctness-only baseline | Naive answer-match / accuracy theater |

## Success criteria
- ≥11 pages, ≥25 features, ≥5 flows, ≥30 goldens, build + app-up green
- Soft-sim honesty visible on landing and `/honesty`
- Buyer can complete release-gate compare without clinical claims
