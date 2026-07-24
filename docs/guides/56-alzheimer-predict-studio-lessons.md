# Lessons — Alzheimer Predict Studio

**Product:** Alzheimer Predict Studio (`alzheimer-predict-studio`)  
**Paper:** https://arxiv.org/abs/2607.11656v1  
**Date:** 2026-07-24

## What worked

1. **Buyer story before IA** — Clinical ML teams who refuse impute-then-predict made the page map obvious: cohorts → features → models → uncertainty → explanations → compare.
2. **Dual score that encodes the claim** — Score A rewards missingness honesty and calibration; score B fills missingness and looks more “complete” while honesty/calibration collapse. Goldens become a story, not arbitrary numbers.
3. **Distinct IA** — Avoiding `/jobs` `/lifecycle` `/scenario` desk shells kept the product from looking like a noun-swap of prior studios or MSK Care.

## What to watch

1. Soft-simulation is not clinical certification — keep the honesty fence and Sources on landing and `/honesty`.
2. Do not brand as NITROGEN; the paper is research input, not a license to rebrand.
3. Export and webhook paths need bearer/HMAC — browser downloads must send auth when APIs are guarded.

## Sustain checklist reminder

- ≥20 features, ≥8 pages, ~30 dual-impl goldens
- `npm test` + live `npm run test:app-up`
- Tutor guide + README + try.html + PORTFOLIO Complete
