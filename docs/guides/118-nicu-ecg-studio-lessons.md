# Nicu Ecg Studio — what we learned

## Product
Soft-sim bench for NICU analytics / neonatal monitoring leads comparing **alignment-free PPG-guided ECG** (`alignment_free_ppg_ecg`) against an **alignment-dependent PPG-to-ECG baseline** (`alignment_dependent_ppg_ecg_baseline`) before locking an ecg pack.

Paper: https://www.medrxiv.org/content/10.64898/2026.07.06.26357087v1 · authors’ code: none published.

## Category practices shipped
- Eval / industrial soft-sim: dual A/B, goldens (≥30 `ne-*`), scoreboard, versioned packs
- Platform must-haves: bearer auth, org/members, audit, export JSON/CSV, webhook HMAC, rate limit, pagination, search
- Commercial surfaces: `/`, `/pricing`, `/demo`, `/onboarding`, `/flows` (≥5 named journeys), `/honesty`

## Domain IA (anti-clone)
Ecgs · ppg · inpaints · runs · compare — **not** `/jobs`, `/lifecycle`, `/scenario` desk shells. Not authors’ brand.

## Honesty
Soft-sim only. Never claim clinical diagnostic use, live device write-back, or FDA clearance.

## Lessons
1. Domain nouns (ecgs/ppg/inpaints) force distinct UX more effectively than renaming a prior desk.
2. Alignment optimism is useful “bad path” fuel for baseline B when neonates break forced sync.
3. Tutor guide + try.html + live app-up smoke are required before sustain email.
