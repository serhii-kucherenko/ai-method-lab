# Share Colearn Studio — what we learned

Product: `share-colearn-studio`  
Paper: https://www.medrxiv.org/content/10.64898/2026.07.16.26358271v1 (SHARE human–AI co-learning for disease activity labeling)

## Category practices shipped

Eval / labeling bench:

- Dual scorers: `human_ai_colearning_labeling` vs `ai_only_labeling_baseline`
- ≥30 deterministic goldens (`sc-001`…`sc-030`)
- Scoreboard + compare delta view
- Versioned colearn packs, label sets, reviewers, runs
- Platform must-haves: bearer auth, org/members, audit, export JSON/CSV, webhook HMAC, rate limit, pagination, search

## Design

Literata + Figtree; chart ink / share teal / cool mist. Domain IA only — no `/jobs` `/lifecycle` `/scenario` desk clones.

## Honesty

Soft-sim only. Never claim clinical diagnostic use, live EHR write-back, or FDA clearance. Not an authors' rebrand.

## Flows (≥5)

1. Create colearn pack  
2. Configure disease activity labels  
3. Assign human reviewers  
4. Run A/B compare  
5. Export + webhook  

## Deferred

Live EHR connectors, real clinician UI, FDA pathway work — out of scope for method-lab soft-sim.
