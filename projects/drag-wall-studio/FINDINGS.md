# FINDINGS — Drag Wall Studio

## Shipped

- Distinct IA: channels / actuators / sensors / controllers (no jobs/lifecycle/scenario desk shells)
- Dual scorers: ES closed-loop (A) vs open-loop/gradient (B), dual-impl goldens ≥30
- Commercial surfaces: `/pricing`, `/demo`, `/onboarding`, `/flows` (≥5), `/honesty`
- Platform: bearer auth, org/members, webhook HMAC, audit, export, search, pagination, rate limit
- Design: Sora + IBM Plex Sans, navy/cyan/mist, full-bleed hero

## Honesty

Soft-sim only. Not live plant. Not certified CFD. Inspired by arXiv 2607.12626; authors’ code none published.

## Tests

`npm test`, `npm run build`, `npm run test:app-up` green at sustain.
