# FINDINGS — Latent Path Studio

## Claim exercised
Multi-domain latent trajectory scoring can be soft-sim compared against a single-domain baseline with dual-impl goldens and distinct cohort analytics IA.

## Evidence
- 30 goldens (`lp-001`…`lp-030`) match both scorers
- Feature inventory ≥25 including auth, webhook HMAC, audit, export, scoreboard
- Live `next build` + app-up smoke required before finish

## Limits
Soft-sim only. Not clinical diagnostic, not crisis intervention, not EHR write-back, not suicide-risk clearance.
