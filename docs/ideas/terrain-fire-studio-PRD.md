# PRD — Terrain Fire Studio

## Problem
Wildfire GIS teams drape new aerial photos onto stale DEMs. Seams, slope errors, and fuel-layer drift make crews distrust refreshes — or worse, trust naive overlays that look sharp but are geometrically wrong.

## Solution
Terrain Fire Studio lets planning leads:

1. Register **versioned terrain packs** for landscapes
2. Ingest **aerial refreshes** with capture metadata
3. Author **alignment plans** (control points, elevation priors, seam budgets)
4. **Compare** physics-aware refresh quality (A) vs naive overlay (B)
5. **Audit / export** for reviewers; invite org members; configure webhooks

## Users
| Role | Needs |
|------|--------|
| GIS planning lead | Packs, refreshes, compare winner |
| Alignment engineer | Alignment plans, control quality |
| Compliance reviewer | Audit trail, JSON/CSV export |
| Org owner | Members, settings, pricing tier |

## Non-goals
- Live incident dispatch
- Survey certification
- Branding as LTM
- Desk shell noun-swap

## Success metrics (lab)
- ≥25 features, ≥11 pages, ≥5 named flows
- Dual goldens ~30 pass
- `next build` + app-up green
- Distinct IA from Sign Stream / Optical Stack
