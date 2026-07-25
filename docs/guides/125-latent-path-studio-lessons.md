# Latent Path Studio — what we learned

Guide **125** for product `latent-path-studio`.

## Category
Eval / soft-sim bench for adolescent MH analytics: versioned cohort packs, cohorts, predictors, trajectories, outcomes, dual scorers, scoreboard.

## Practices shipped
- Dual-impl goldens (`lp-001`…`lp-030`) for `multi_domain_latent_trajectory` vs `single_domain_baseline`
- Distinct domain IA (packs / cohorts / predictors / trajectories / outcomes) — no `/jobs` `/lifecycle` `/scenario` desk clone
- Platform must-haves: bearer auth, members/org, webhook HMAC, audit, export, search, pagination, rate limits, scoreboard
- ≥5 named flows on `/flows` with actor / job / success / empty paths
- Marketing landing sells buyer outcome (multi-domain latent adolescent MH paths)
- Soft-sim honesty: not clinical diagnostic, not crisis intervention, not live EHR write-back, not suicide-risk clearance

## Deferred
- Real survey ingest / LCGA fitting
- Live EHR or crisis routing (explicitly out of scope)

## Sources
- Paper: https://osf.io/preprints/psyarxiv/ed5nq_v1/
- Authors’ code: none
