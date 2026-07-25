# Citizen Pref Studio — what we learned

Guide **127** for product `citizen-pref-studio`.

## Category
Eval / soft-sim bench for AI governance preferences: versioned policy packs, regulatory options, country cohorts, survey batches, preference runs, dual scorers, scoreboard.

## Practices shipped
- Dual-impl goldens (`cp-001`…`cp-030`) for `safety_first_public_oversight` vs `innovation_first_self_regulation`
- Distinct domain IA (packs / options / countries / surveys / prefs) — no `/jobs` `/lifecycle` `/scenario` desk clone
- Platform must-haves: bearer auth, members/org, webhook HMAC, audit, export, search, pagination, rate limits, scoreboard
- ≥5 named flows on `/flows` with actor / job / success / empty paths
- Marketing landing sells buyer outcome (safety-first citizen-aligned AI policy packs)
- Soft-sim honesty: not live regulatory authority, not government deployment, not certified public-opinion polling, not authors’ survey brand

## Deferred
- Real conjoint survey fieldwork ingest
- Live regulatory or government deployment (explicitly out of scope)

## Sources
- Paper: https://arxiv.org/abs/2607.14585v1
- Authors’ code: none
