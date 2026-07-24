# FINDINGS — Pathology Slide Studio

## What worked
- Distinct IA (cohorts / embed / slides / compare) avoids desk-clone failure modes.
- Dual-impl multi-signal vs vision-only goldens give a clear unique claim without shipping model weights.
- Landing brand + rose-gray / teal tokens match the DESIGN brief and stay off purple-AI defaults.

## What we avoided
- Branding as ALICE or claiming clinical diagnosis.
- Primary routes `/jobs` `/lifecycle` `/scenario` `/batch` `/goldens`.

## Dual score
- **A (multi_signal):** vision morphology + vision-language alignment + slide-level context / MIL.
- **B (vision_only):** morphology / texture / stain only.

## Sustain notes
Live `next build` + `test:app-up` required; unit/API green alone is not enough.
