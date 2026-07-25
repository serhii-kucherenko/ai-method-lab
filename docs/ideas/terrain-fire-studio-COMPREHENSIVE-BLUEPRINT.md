# Blueprint — Terrain Fire Studio

## Category
**Industrial / public-safety GIS** — agency seats + refresh compute; physics-aware terrain refresh vs naive photo-on-DEM overlay.

## Pages (≥11; NOT desk clone; NOT Sign Stream a11y; NOT Optical Stack coatings)

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing — sell alignment-before-trust for wildfire terrain |
| `/pricing` | Hypothetical tiers: Pilot · Agency · Site license |
| `/demo` | Step-by-step guided happy path (one showcase) |
| `/onboarding` | First-run checklist with visible progress |
| `/flows` | Multi-flow index — ≥5 named journeys with entry CTAs |
| `/packs` | Versioned terrain pack registry |
| `/aerials` | Aerial refresh workspace |
| `/alignment` | Alignment plan board |
| `/compare` | Physics-aware (A) vs naive overlay (B) |
| `/settings` | Org, members, webhook, exports, audits |
| `/honesty` | Soft-sim fence + Sources |

Forbidden primary IA: `/jobs` `/lifecycle` `/scenario` `/batch` `/goldens` · no streams/glossary · no coating stacks

## Named user flows (≥5)

| Flow | Actor | Job | Entry |
|------|-------|-----|-------|
| First-run onboarding | GIS program lead | Stand up studio | `/onboarding` |
| Pack → aerial → align → score | Terrain engineer | Register pack + refresh + plan | `/packs` |
| Physics-aware vs naive compare | Fire-planning reviewer | Falsify overlay baseline | `/compare` |
| Alignment plan review | Alignment engineer | Tune control density + seam budget | `/alignment` |
| Audit + export | Compliance reviewer | Export JSON/CSV + audits | `/settings` |
| Invite / org settings | Org owner | Invite planner + org save | `/settings` |
| Pricing-tier selection | Buyer | Pick Pilot/Agency/Site | `/pricing` |

Each flow documents steps, success, and empty/error on `/flows`.

## Platform must-haves (industrial GIS / public-safety mapping)

- Versioned terrain packs
- Aerial refresh workspace + search/filter
- Alignment / refresh plans
- Dual compare (physics-aware vs naive overlay)
- Org settings + member invite + roles
- Audit trail + JSON/CSV export
- Idempotent webhook + bearer auth + rate limit
- Onboarding checklist + soft-sim honesty
- Multi-flow index `/flows`

## Dual score

| Impl | Meaning |
|------|---------|
| **A** | Physics-aware terrain refresh quality |
| **B** | Naive photo-on-DEM overlay baseline |

## Feature matrix (≥25)

1. Marketing landing  
2. Pricing page with tiers  
3. Guided step-by-step demo  
4. Onboarding checklist with progress  
5. Multi-flow index (`/flows`)  
6. Terrain pack create / list / archive  
7. Pack versioning + search/filter by region/status  
8. Aerial refresh create with capture metadata  
9. Alignment plan create (control density, elevation prior, seam budget)  
10. Dual score panel (A vs B)  
11. Physics-aware vs naive overlay compare + winner  
12. Honesty fence page  
13. Soft-sim / not-dispatch honesty notes  
14. Org settings edit  
15. Member invite / role  
16. Bearer auth on APIs  
17. Rate-limit feedback  
18. Idempotent webhook  
19. Export packs JSON  
20. Export compares CSV  
21. Features inventory API  
22. Goldens sample API  
23. Audit trail  
24. In-app guide link  
25. try.html offline demo  
26. Seed demo pack from onboarding  
27. Pagination on list APIs  
28. Alignment plan status board  

## Aggregates

TerrainPack, AerialRefresh, AlignmentPlan, RefreshCompare (+ Org/Members/Audits)

## Test themes

- Dual-impl goldens ≥30  
- Store CRUD + compare + webhook idempotency + ≥25 features  
- UI critical path per page including `/pricing` `/demo` `/onboarding` `/flows`  
- Live app-up (build + start GET `/`)  
