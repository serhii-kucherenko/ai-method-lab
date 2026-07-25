# Atlas Flow Studio — what we learned

Product: `atlas-flow-studio`  
Paper: https://www.biorxiv.org/content/10.64898/2026.07.15.737186v1 (NeuroFlow-style integrated atlas registration + quantification)

## Category practices shipped

Eval / atlas bench:

- Dual scorers: `integrated_atlas_workflow` vs `fragmented_multi_tool_baseline`
- ≥30 deterministic goldens (`af-001`…`af-030`)
- Scoreboard + compare delta view
- Versioned atlas packs, registrations, quantifications, runs
- Platform must-haves: bearer auth, org/members, audit, export JSON/CSV, webhook HMAC, rate limit, pagination, search

## Design

Fraunces + Manrope; atlas ink / register teal / cool mist. Domain IA only — no `/jobs` `/lifecycle` `/scenario` desk clones.

## Honesty

Soft-sim only. Never claim live microscope control, clinical diagnostic use, or FDA clearance. Not NeuroFlow. Not an authors' rebrand.

## Flows (≥5)

1. Create atlas pack  
2. Configure registration  
3. Configure quantification  
4. Run A/B compare  
5. Export + webhook  

## Deferred

Live microscope connectors, real histology pipelines, FDA pathway work — out of scope for method-lab soft-sim.
