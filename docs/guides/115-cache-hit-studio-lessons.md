# Cache Hit Studio — lessons

## What we built
A soft-sim studio for computational chemistry / immuno-oncology discovery leads to compare structured CACHE-style computational hit-finding against naive docking baselines before locking a hit pack.

## Category practices shipped
- Eval / discovery-chemistry bench: goldens (≥30), dual A/B scorers, scoreboard, versioned packs
- Platform: bearer auth, org/members, audit, export JSON/CSV, HMAC webhook, rate limit, pagination, search

## Domain IA (anti-clone)
Hits, targets, compounds, runs, compares — not `/jobs` `/lifecycle` `/scenario` desk shells. Not CACHE brand.

## Honesty fence
Soft-sim only — not wet-lab validated hits, not live ELN write-back, not FDA cleared, not CACHE, not the authors’ system.

## Dual scorers
- A: `structured_hit_finding`
- B: `naive_docking_baseline`

## What we deferred
Live ELN write-back, wet-lab validated hit claims, FDA pathway packaging — intentionally out of scope for method-lab soft-sim.

## Sources
ChemRxiv 10.26434/chemrxiv.15005792 · authors’ code: none published
