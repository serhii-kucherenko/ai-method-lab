# Guide 09 — Heart Rhythm Desk: what we learned

**Product display name:** Heart Rhythm Desk  
**Slug:** `heart-rhythm-desk` (folder + cell ids only)  
**Paper:** 2607.14613 — Adaptive Guided Supervised Contrastive Learning for Long-Tailed Electrocardiogram Arrhythmia Diagnosis  
**Paper URL:** https://arxiv.org/abs/2607.14613v1  
**Code URL (authors):** https://github.com/Open-EXG/AG-SCL-for-Long-Tailed-ECG

## What we built

The first Method Lab product on the **Next.js + Tailwind + shadcn** stack: a multi-page desk for org projects and rhythm jobs with enforced lifecycle, scenario compare (majority baseline vs long-tail-aware), audit CSV, signed webhooks, goldens browser, designed App Router UI, and an offline try page.

## What worked

- Design note committed **before** multi-page UI (`docs/ideas/heart-rhythm-desk-DESIGN.md`)
- Mature display name from day one — never brand the desk AG-SCL
- Honesty fence: method experiment, **not** the authors' model, **not** a clinical ECG reader
- Rhythm-fit dual-impl goldens (≥25) before sustain
- Keep pure domain math outside React so Vitest/tsx tests stay fast; Next owns the chrome
- Offline `try.html` still double-clickable for digests

## What to improve next time

1. **Wire Next API routes early** so production `next start` and the test HTTP harness share one dispatcher without drift.
2. **Scenario page first.** Majority vs long-tail teaches the paper claim faster than job CRUD alone.
3. **shadcn + DESIGN tokens together.** Init Radix base, then map CSS variables to the design note — do not leave default shadcn gray as the product look.
4. **ECG-themed fixtures** (PVC, LBBB, …) read clearer than noun-swapped biology tags.

## Reuse checklist

- [ ] Display name + slug chosen before fixtures dominate conversation
- [ ] DESIGN.md committed before multi-page UI
- [ ] Next.js + Tailwind + shadcn per `docs/PRODUCT_STACK.md`
- [ ] Blueprint lists ≥15 features mapped to ≥6 pages and ≥4 aggregates
- [ ] Honesty fence on honesty page, try.html, and digests
- [ ] No authors'-model replacement claim
- [ ] No clinical ECG reader claim
- [ ] No paper short-name branding on product surfaces
- [ ] Guide filed under `docs/guides/` before product-complete email
