# Mhc Design Studio — what we learned

## Claim
Immuno-oncology / vaccine design analytics leads need a soft-sim bench that compares hybrid quantum–classical de novo MHC-binding peptide design to classical generative baselines before locking a peptide pack — not a therapy desk or isomorphic clone.

## Category practices shipped
- Eval bench: ≥30 dual-impl goldens (`md-001…md-030`), A/B compare, scoreboard
- Domain IA: peptides / alleles / designs / runs (no `/jobs` `/lifecycle` `/scenario`)
- Platform: bearer auth, members, audit, export JSON/CSV, webhook HMAC, rate limit, pagination
- Commercial surfaces: `/pricing`, `/demo`, `/onboarding`, `/flows` (≥5), `/honesty`
- Offline `try.html` + live `test:app-up`

## Honesty
Never claim wet-lab validated binders, live ELN write-back, or FDA clearance. Not the authors’ system.

## Deferred
Live ELN connectors, real quantum annealers / generative model training pipelines, and production checkout — out of soft-sim scope.
