# Guide 12 — Secure Tutor Desk: what we learned

**Product display name:** Secure Tutor Desk  
**Slug:** `secure-tutor-desk` (folder + cell ids only)  
**Paper:** 2607.14601 — SYNAPSE: A Multi-LLM Orchestrated AI Tutor for Secure Software Development Education with Neurodivergent-First Design  
**Paper URL:** https://arxiv.org/abs/2607.14601v1  
**Code URL (authors):** none published

## What we built

A multi-page desk on **Next.js + Tailwind + shadcn** with a **marketing landing at `/`**, org projects and tutor jobs with enforced lifecycle, scenario compare (single-model baseline vs multi-LLM orchestrated), audit CSV, signed webhooks, goldens browser, designed App Router UI, and an offline try page.

## What worked

- Design note with **landing brief** committed before multi-page UI (`docs/ideas/secure-tutor-desk-DESIGN.md`)
- Mature display name from day one — never brand the desk SYNAPSE
- Honesty fence: method experiment, **not** the authors' tutoring platform, **not** a live tutoring course product; Sources say none published
- Tutor-fit dual-impl goldens (≥25) before sustain
- Landing sells the product; desk chrome starts at `/jobs`
- Keep pure domain math outside React so tsx tests stay fast; Next owns the chrome
- Offline `try.html` still double-clickable for digests
- Reusing the Realtime Deploy Desk ladder pattern shortened climb time without isomorphic dual-gate cheating — domain claim stayed multi-LLM tutoring vs single-model

## What to improve next time

1. **Ship the marketing landing first.** Hero → problem → product → selling points → features → how it works → honesty → sources → footer CTA, with UI critical path covering Sources and Open desk.
2. **Wire Next API routes early** so production `next start` and the test HTTP harness share one dispatcher without drift.
3. **Scenario page early.** Single-model vs multi-LLM teaches the paper claim faster than job CRUD alone.
4. **shadcn + DESIGN tokens together.** Init Radix base, then map CSS variables to the design note — do not leave default shadcn gray as the product look.
5. **Role/intent fixtures** (socratic, practice, analogy, security-check) read clearer than noun-swapped tags from a prior desk.
6. **Python sidecar only when needed.** This claim stayed readable as dual-impl TypeScript; do not invent a FastAPI process for score arithmetic that does not need NumPy/Torch.

## Reuse checklist

- [ ] Display name + slug chosen before fixtures dominate conversation
- [ ] DESIGN.md with landing brief committed before multi-page UI
- [ ] Marketing landing at `/`; desk entry at `/jobs`
- [ ] Next.js + Tailwind + shadcn per `docs/PRODUCT_STACK.md`
- [ ] Blueprint lists ≥15 features mapped to ≥6 pages and ≥4 aggregates
- [ ] Honesty fence on honesty page, try.html, and digests
- [ ] ≥25 dual-impl goldens green
- [ ] Tutor guide under `docs/guides/` before finish email
- [ ] Never brand with the paper short name
