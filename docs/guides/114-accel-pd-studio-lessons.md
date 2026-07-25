# Accel PD Studio — lessons

## What we built
A soft-sim studio for digital biomarker / neurology analytics leads to compare multi-channel transformer physical-activity representations against handcrafted PA-feature baselines before locking an accel pack.

## Category practices shipped
- Eval / digital-biomarker bench: goldens (≥30), dual A/B scorers, scoreboard, versioned packs
- Platform: bearer auth, org/members, audit, export JSON/CSV, HMAC webhook, rate limit, pagination, search

## Domain IA (anti-clone)
Accels, channels, representations, runs, compares — not `/jobs` `/lifecycle` `/scenario` desk shells. Not PABformer brand.

## Honesty fence
Soft-sim only — not clinical diagnostic use, not live device write-back, not FDA cleared, not PABformer, not the authors’ system.

## Dual scorers
- A: `multichannel_pa_transformer`
- B: `handcrafted_pa_baseline`

## What we deferred
Live wearable device write-back, clinical diagnostic claims, FDA pathway packaging — intentionally out of scope for method-lab soft-sim.

## Sources
medRxiv 10.1101/2025.08.12.25333460 · authors’ code: none published
