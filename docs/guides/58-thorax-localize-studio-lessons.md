# Lessons — Thorax Localize Studio

## What worked

- **Domain-first IA** — `/exams` `/findings` `/lesions` `/maps` `/validation` `/compare` reads as a CXR localize workflow, not a noun-swapped desk or Cardiac CT clone.
- **Dual score with an honest gap** — classify + localize (A) vs classify-only (B) makes the buyer claim falsifiable in goldens and on `/compare`.
- **Landing sells the buyer outcome** — disease labels with lesion location, not a generic “lab desk.”

## What to avoid next time

- Copying Cardiac CT’s studies/annotations/segments/phenotypes shell — different clinical claim needs different nouns and pages.
- Branding as Inspectra or claiming PACS/certification; keep the honesty fence early and visible.
- Skipping live `next build` + `next start` smoke; API/unit green alone is not sustain.

## Patterns to reuse

- Dual-impl scoring (`score.ts` / `scoreB.ts`) with ~30 fixtures.
- In-memory store + bearer/webhook/export for comprehensive API bar.
- Tutor guide + `try.html` before finish email.

## Sources

- Paper: https://arxiv.org/abs/2607.09305v1
- Product: `projects/thorax-localize-studio/`
