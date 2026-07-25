# Lessons — Consult Bench Studio

## What worked

- **Domain-first IA** — `/cases` `/turns` `/departments` `/scores` `/leaderboard` `/compare` reads as a multimodal consult-eval workflow, not a noun-swapped desk or Reason Frame rules/debates shell.
- **Dual score with an honest gap** — multimodal-aware next-response quality (A) vs text-only baseline (B) makes the buyer claim falsifiable in goldens and on `/compare`.
- **Landing sells the consult outcome** — score the reply when the photo changes the answer, not a generic “lab desk.”

## What to avoid next time

- Branding as MedRealMM or claiming clinical certification / live hospital chat; keep the honesty fence early and visible.
- Copying Reason Frame `/rules` `/debates` `/flags` or desk `/jobs` `/lifecycle` shells — this product needs cases, turns, departments, and leaderboard.
- Skipping live `next build` + `next start` smoke; API/unit green alone is not sustain.

## Patterns to reuse

- Dual-impl scoring (`score.ts` / `scoreB.ts`) with ~30 fixtures.
- In-memory store + bearer/webhook/export for comprehensive API bar.
- Tutor guide + `try.html` before finish email.

## Sources

- Paper: https://arxiv.org/abs/2607.09142v1
- Product: `projects/consult-bench-studio/`
