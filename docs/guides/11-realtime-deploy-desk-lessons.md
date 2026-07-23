# Guide 11 — Realtime Deploy Desk: what we learned

**Product display name:** Realtime Deploy Desk  
**Slug:** `realtime-deploy-desk` (folder + cell ids only)  
**Paper:** 2607.18171 — FlashRT: Agent Harness for Guiding Agents to Deploy Real-Time Multimodal Applications  
**Paper URL:** https://arxiv.org/abs/2607.18171v1  
**Code URL (authors):** none published with this paper

## What we built

A multi-page desk on **Next.js + Tailwind + shadcn** with a **marketing landing at `/`**, org projects and deploy jobs with enforced lifecycle, scenario compare (manual-tuning baseline vs harness-guided), audit CSV, signed webhooks, goldens browser, designed App Router UI, and an offline try page.

## What worked

- Design note with **landing brief** committed before multi-page UI (`docs/ideas/realtime-deploy-desk-DESIGN.md`)
- Mature display name from day one — never brand the desk FlashRT
- Honesty fence: method experiment, **not** the authors' harness, **not** a production serving stack; Sources say none published
- Deploy-fit dual-impl goldens (≥25) before sustain
- Landing sells the product; desk chrome starts at `/jobs`
- Keep pure domain math outside React so tsx tests stay fast; Next owns the chrome
- Offline `try.html` still double-clickable for digests
- Reusing the Pathology Vision Desk ladder pattern shortened climb time without isomorphic dual-gate cheating — domain claim stayed harness-guided deploy scoring

## What to improve next time

1. **Ship the marketing landing first.** Hero → problem → product → selling points → features → how it works → honesty → sources → footer CTA, with UI critical path covering Sources and Open desk.
2. **Wire Next API routes early** so production `next start` and the test HTTP harness share one dispatcher without drift.
3. **Scenario page early.** Manual-tuning vs harness-guided teaches the paper claim faster than job CRUD alone.
4. **shadcn + DESIGN tokens together.** Init Radix base, then map CSS variables to the design note — do not leave default shadcn gray as the product look.
5. **Harness/config fixtures** (ir-lift, measure-gate, placement) read clearer than noun-swapped biology tags from a prior desk.
6. **Python sidecar only when needed.** This claim stayed readable as dual-impl TypeScript; do not invent a FastAPI process for score arithmetic that does not need NumPy/Torch.

## Reuse checklist

- [ ] Display name + slug chosen before fixtures dominate conversation
- [ ] DESIGN.md with landing brief committed before multi-page UI
- [ ] Marketing landing at `/`; desk entry at `/jobs`
- [ ] Next.js + Tailwind + shadcn per `docs/PRODUCT_STACK.md`
- [ ] Blueprint lists ≥15 features mapped to ≥6 pages and ≥4 aggregates
- [ ] Honesty fence on honesty page, try.html, and digests
- [ ] Sources: paper URL + authors' code (or none published)
- [ ] No authors'-harness replacement claim
- [ ] No production serving stack claim
- [ ] No paper short-name branding on product surfaces
- [ ] Guide filed under `docs/guides/` before product-complete email
