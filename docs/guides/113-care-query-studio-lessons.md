# Care Query Studio — what we learned

Tutor guide for Method Lab product `care-query-studio`.

## Category practices shipped

Eval / clinical LLM bench:

- Goldens (≥30 dual-impl `cq-001…cq-030`)
- Dual compare (multilingual POC LLM answers vs local clinician baseline)
- Scoreboard + versioned query packs
- Honesty fence (soft-sim; not diagnostic / live EHR / FDA / NigBench)
- Platform must-haves: bearer auth, org/members, audit, export, HMAC webhook, rate limit, search, pagination

## What not to claim

Never claim clinical diagnostic use, live EHR write-back, or FDA clearance. Not NigBench and not an authors’ rebrand of the medRxiv multilingual POC medical query benchmark.

## Anti-clone

Domain IA only: queries, locales, answers, runs, compares. No `/jobs` `/lifecycle` `/scenario` isomorphic desk shells.

## Flows (≥5)

1. Create query pack  
2. Configure locales  
3. Configure answer rubrics  
4. Run A/B compare  
5. Export + webhook  

## Design tokens

Literata + Figtree; clinic ink / care teal / cool mist / amber — not purple, not cream-terracotta broadsheet.
