# Lessons — Cardiac CT Studio

## What worked

- **Domain-first IA** — `/studies` `/annotations` `/segments` `/phenotypes` `/augment` `/compare` reads as a cardiac imaging workflow, not a noun-swapped desk.
- **Dual score with an honest gap** — HITL + foundation phenotyping (A) vs auto-only (B) makes the buyer claim falsifiable in goldens and on `/compare`.
- **Landing sells the buyer outcome** — expert-in-the-loop segmentation and phenotype confidence, not a generic “lab desk.”

## What to avoid next time

- Copying Alzheimer Predict’s cohorts/features/models shell — different clinical claim needs different nouns and pages.
- Claiming PACS or certification in copy; keep the honesty fence early and visible.
- Skipping live `next build` + `next start` smoke; API/unit green alone is not sustain.

## Patterns to reuse

- Dual-impl scoring (`score.ts` / `scoreB.ts`) with ~30 fixtures.
- In-memory store + bearer/webhook/export for comprehensive API bar.
- Tutor guide + `try.html` before finish email.

## Sources

- Paper: https://arxiv.org/abs/2607.11287v1
- Product: `projects/cardiac-ct-studio/`
