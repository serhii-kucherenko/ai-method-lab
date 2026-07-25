# PRD — Drive Horizon Studio

## Problem
World-model eval often greens flat single-level rollouts that look smooth but miss coarse scene structure. Hierarchical coarse+detail forecasts need a dedicated compare before planner packs lock.

## Goals
1. Register and version scenario packs.
2. Author coarse scene structure boards.
3. Tune detail-generator workspaces.
4. Compare hierarchical world-model (A) vs flat naive rollout (B).
5. Rank compares on a scoreboard; audit and export for reviewers.
6. Ship ≥5 named flows + industrial-sim platform must-haves.

## Non-goals
- Branding as Orbis / Orbis 2
- Live vehicle deployment or certification claims
- Desk shell noun-swap (`/jobs` `/lifecycle` `/scenario` `/batch` `/goldens`)

## Personas
| Role | Job |
|------|-----|
| Sim eval lead | Stand up packs and lock dual-score policy |
| World-model engineer | Coarse scene → detail generator → score |
| Planner pack reviewer | Compare A vs B and read scoreboard |
| Compliance / audit | Export + audit trail |
| Buyer | Pick bench seats / scenario pack tier |

## Dual score
| Impl | Meaning |
|------|---------|
| **A** | Hierarchical world model — coarse scene structure + detail generator quality |
| **B** | Flat single-level world-model / naive rollout baseline |

## Success metrics (method lab)
≥11 pages, ≥25 features, ≥5 flows, ≥30 goldens dual-impl, build + app-up green, guide shipped.
