# Therapy Prompt Studio — what we learned

Tutor guide for Method Lab product `therapy-prompt-studio`.

## Category practices shipped

Eval / LLM safety bench:

- Goldens (≥30 dual-impl `tp-001…tp-030`)
- Dual compare (structured therapy-safety gates vs prompt-only safety baseline)
- Scoreboard + versioned prompt packs
- Honesty fence (soft-sim; not clinical therapy / crisis line / live patient chat / FDA)
- Platform must-haves: bearer auth, org/members, audit, export, HMAC webhook, rate limit, search, pagination

## What not to claim

Never claim clinical therapy, crisis hotline replacement, live patient chat write-back, or FDA clearance. Not an authors’ rebrand of the medRxiv prompt-engineering safety study.

## Anti-clone

Domain IA only: prompts, scenarios, gates, runs, compares. No `/jobs` `/lifecycle` isomorphic desk shells. `/scenarios` is the psychiatric scenario-suite domain page only.

## Flows (≥5)

1. Create prompt pack  
2. Configure high-risk scenarios  
3. Configure structured safety gates  
4. Run A/B compare  
5. Export + webhook  

## Design tokens

Source Serif 4 + IBM Plex Sans; clinic ink / calm teal / cool mist / amber — not purple, not cream-terracotta broadsheet.
