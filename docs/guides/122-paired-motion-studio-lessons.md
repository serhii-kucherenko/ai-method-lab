# Paired Motion Studio — what we learned

## Claim
Embodied AI / VR-AR / mocap analytics leads need a soft-sim bench that compares distributed ego+exo HMD motion capture to ego-only baselines before locking a capture pack — not a contact-arm desk or isomorphic clone.

## Category practices shipped
- Eval bench: ≥30 dual-impl goldens (`pm-001…pm-030`), A/B compare, scoreboard
- Domain IA: captures / wearers / observers / sessions / runs (no `/jobs` `/lifecycle` `/scenario`)
- Platform: bearer auth, members, audit, export JSON/CSV, webhook HMAC, rate limit, pagination
- Commercial surfaces: `/pricing`, `/demo`, `/onboarding`, `/flows` (≥5), `/honesty`
- Offline `try.html` + live `test:app-up`

## Honesty
Never claim live HMD fleet control, production mocap suit replacement, Meta/Aria deployment, or the EgoExoMoCap brand. Not the authors’ system.

## Deferred
Live HMD fleet orchestration, production mocap suit calibration pipelines, and Meta/Aria device SDKs — out of soft-sim scope.
