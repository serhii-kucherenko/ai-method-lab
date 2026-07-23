# Guide 10 — Pathology Vision Desk: what we learned

**Product display name:** Pathology Vision Desk  
**Slug:** `pathology-vision-desk` (folder + cell ids only)  
**Paper:** 2607.09526 — ALICE: Learning a General-Purpose Pathology Foundation Model from Vision, Vision-Language, and Slide-Level Experts  
**Paper URL:** https://arxiv.org/abs/2607.09526v1  
**Code URL (authors):** https://github.com/WonderLandxD/ALICE

## What we built

A multi-page desk on **Next.js + Tailwind + shadcn** for org projects and vision jobs with enforced lifecycle, scenario compare (single-view baseline vs multi-expert), audit CSV, signed webhooks, goldens browser, designed App Router UI, and an offline try page.

## What worked

- Design note committed **before** multi-page UI (`docs/ideas/pathology-vision-desk-DESIGN.md`)
- Mature display name from day one — never brand the desk ALICE
- Honesty fence: method experiment, **not** the authors' model, **not** a clinical diagnostic tool
- Pathology-fit dual-impl goldens (≥25) before sustain
- Keep pure domain math outside React so tsx tests stay fast; Next owns the chrome
- Offline `try.html` still double-clickable for digests
- Reusing the Heart Rhythm Desk ladder pattern shortened climb time without isomorphic dual-gate cheating — domain claim stayed pathology multi-expert fusion

## What to improve next time

1. **Wire Next API routes early** so production `next start` and the test HTTP harness share one dispatcher without drift.
2. **Scenario page first.** Single-view vs multi-expert teaches the paper claim faster than job CRUD alone.
3. **shadcn + DESIGN tokens together.** Init Radix base, then map CSS variables to the design note — do not leave default shadcn gray as the product look.
4. **Expert-module fixtures** (vision, vision-language, slide) read clearer than noun-swapped biology tags from a prior desk.
5. **Python sidecar only when needed.** This claim stayed readable as dual-impl TypeScript; do not invent a FastAPI process for score arithmetic that does not need NumPy/Torch.

## Reuse checklist

- [ ] Display name + slug chosen before fixtures dominate conversation
- [ ] DESIGN.md committed before multi-page UI
- [ ] Next.js + Tailwind + shadcn per `docs/PRODUCT_STACK.md`
- [ ] Blueprint lists ≥15 features mapped to ≥6 pages and ≥4 aggregates
- [ ] Honesty fence on honesty page, try.html, and digests
- [ ] No authors'-model replacement claim
- [ ] No clinical diagnostic claim
- [ ] No paper short-name branding on product surfaces
- [ ] Guide filed under `docs/guides/` before product-complete email
