# 98 — Transducin Measure Studio lessons

## What shipped
A comprehensive soft-sim studio where ophthalmology imaging / clinical-data leads version **measure packs**, configure **Optopol/Zeiss parsers** and **DICOM SR exports**, run **measure soft-sim runs**, and compare **SNOMED-CT coded OCT recovery (A)** against a **raw private-tag dump baseline (B)** before locking.

## Category practices
- Eval / imaging-interop soft-sim: dual A/B, goldens (tm-001…tm-030), scoreboard, honesty fence
- Platform: bearer auth, org/members, audit, export JSON/CSV, webhook HMAC, rate limit, pagination, search

## Domain IA (anti-clone)
Routes use measures / parsers / exports / runs / compares — not jobs / lifecycle / scenario desk shells.

## Honesty
Soft-sim only. Never claim clinical deployment, live PACS write-back, or diagnostic use. Not an authors’ rebrand of medRxiv 10.64898/2026.07.14.26357256.

## Brand
Literata + Figtree; retina ink / optic teal / cool mist.

## Takeaways
1. Domain nouns must match the buyer story — “measure pack” beats a renamed desk.
2. Dual scorers need ≥30 goldens so lock decisions are regression-tested.
3. Commercial surfaces (`/pricing`, `/demo`, `/onboarding`, `/flows`) carry the product past a calculator costume.
