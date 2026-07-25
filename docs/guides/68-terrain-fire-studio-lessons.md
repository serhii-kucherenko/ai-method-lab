# 68 — Terrain Fire Studio lessons

## Product
**Terrain Fire Studio** — industrial / public-safety GIS for wildfire terrain refresh. Buyer: agency GIS leads who must align new aerials to aging 3D packs before crews trust the ground.

## Category practices shipped
- Versioned terrain packs + search/filter
- Aerial refresh workspace
- Alignment / refresh plans (control density, elevation prior, seam budget)
- Dual compare: physics-aware (A) vs naive overlay (B)
- Org settings, member invite, audit trail, JSON/CSV export
- Idempotent webhook + bearer auth + rate limit
- `/pricing` · `/demo` · `/onboarding` · `/flows` (≥5 named journeys)
- Soft-sim honesty fence (not dispatch, not survey cert)

## Deferred
- Real photogrammetry / DEM pipelines
- Live firefighting dispatch
- Authors’ LTM weights (none published)

## Distinct IA
Not Sign Stream (a11y streams/glossary/latency). Not Optical Stack (coatings). Not desk shells (`/jobs` `/lifecycle` `/scenario` `/batch` `/goldens`).

## Lessons
1. Industrial GIS products need **alignment-before-trust** as the story — naive overlays look sharp and fail on slope/seam.
2. Multi-flow index matters: pack create, alignment review, compare, audit/export, and pricing are different actors.
3. Soft-sim honesty must say “not dispatch / not certification” early — public-safety buyers read that first.
4. Dual goldens (~30) keep physics-aware and naive paths locked across twin impl files.

## Paper
https://arxiv.org/abs/2607.08711v1 — authors’ code: none.
