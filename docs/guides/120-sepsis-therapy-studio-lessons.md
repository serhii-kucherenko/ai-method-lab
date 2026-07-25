# Sepsis Therapy Studio — what we learned

## Claim
Hospital analytics / critical-care leads need a soft-sim bench that compares continuous-time HMM antibiotic therapy effectiveness to static guideline baselines before locking a therapy pack — not a tip-line or desk clone.

## Category practices shipped
- Eval bench: ≥30 dual-impl goldens (`st-001…st-030`), A/B compare, scoreboard
- Domain IA: therapies / regimens / onsets / runs (no `/jobs` `/lifecycle` `/scenario`)
- Platform: bearer auth, members, audit, export JSON/CSV, webhook HMAC, rate limit, pagination
- Commercial surfaces: `/pricing`, `/demo`, `/onboarding`, `/flows` (≥5), `/honesty`
- Offline `try.html` + live `test:app-up`

## Honesty
Never claim clinical diagnostic use, live EHR write-back, or FDA clearance. Not the authors’ system.

## Deferred
Live EHR connectors, real CT-HMM training pipelines, and production checkout — out of soft-sim scope.
