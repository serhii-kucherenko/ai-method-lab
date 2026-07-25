# Pv Causal Studio — what we learned

## Product
Soft-sim bench for pharmacovigilance / RWE analytics eng leads comparing **target-trial causal signal detection** (`target_trial_causal_signal`) against a **spontaneous-reporting baseline** (`spontaneous_reporting_baseline`) before locking a pv pack.

Paper: https://www.medrxiv.org/content/10.64898/2026.07.01.26356874v1 · authors’ code: none published.

## Category practices shipped
- Eval / industrial soft-sim: dual A/B, goldens (≥30 `pc-*`), scoreboard, versioned packs
- Platform must-haves: bearer auth, org/members, audit, export JSON/CSV, webhook HMAC, rate limit, pagination, search
- Commercial surfaces: `/`, `/pricing`, `/demo`, `/onboarding`, `/flows` (≥5 named journeys), `/honesty`

## Domain IA (anti-clone)
Signals · cohorts · exposures · runs · compare — **not** `/jobs`, `/lifecycle`, `/scenario` desk shells. Not authors’ brand.

## Honesty
Soft-sim only. Never claim regulatory submission authority, live claims write-back, or FDA clearance.

## Lessons
1. Domain nouns (signals/cohorts/exposures) force distinct UX more effectively than renaming a prior desk.
2. Tip-line optimism is useful “bad path” fuel for baseline B when spontaneous reporting looks strong without a defined population.
3. Tutor guide + try.html + live app-up smoke are required before sustain email.
