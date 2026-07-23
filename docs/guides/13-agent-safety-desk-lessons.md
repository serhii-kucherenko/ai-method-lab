# Guide 13 — Agent Safety Desk: what we learned

**Product display name:** Agent Safety Desk  
**Slug:** `agent-safety-desk` (folder + cell ids only)  
**Paper:** 2607.14570 — Democratizing Agent Deployment Safety: A Structural Monitoring Approach  
**Paper URL:** https://arxiv.org/abs/2607.14570v1  
**Code URL (authors):** none published

## What we built

A multi-page desk on **Next.js + Tailwind + shadcn** with a **marketing landing at `/`**, org projects and safety jobs with enforced lifecycle, scenario compare (checklist baseline vs structural monitor), audit CSV, signed webhooks, goldens browser, designed App Router UI, and an offline try page.

## What worked

- Design note with **landing brief** committed before multi-page UI (`docs/ideas/agent-safety-desk-DESIGN.md`)
- Mature display name from day one — never brand the desk IFG
- Honesty fence: method experiment, **not** the authors' safety monitor system, **not** a commercial agent safety vendor product; Sources say none published
- Safety-fit dual-impl goldens (≥25) before sustain
- Landing sells the product; desk chrome starts at `/jobs`
- Keep pure domain math outside React so tsx tests stay fast; Next owns the chrome
- Offline `try.html` still double-clickable for digests
- Reusing the prior desk ladder pattern shortened climb time without isomorphic dual-gate cheating — domain claim stayed structural monitoring vs checklist

## What to improve next time

1. **Ship the marketing landing first.** Hero → problem → product → selling points → features → how it works → honesty → sources → footer CTA, with UI critical path covering Sources and Open desk.
2. **Wire Next API routes early** so production `next start` and the test HTTP harness share one dispatcher without drift.
3. **Scenario page early.** Checklist vs structural monitor teaches the paper claim faster than job CRUD alone.
4. **shadcn + DESIGN tokens together.** Init Radix base, then map CSS variables to the design note — do not leave default shadcn gray as the product look.
5. **Invariant/regression fixtures** (invariant, edge, node-class, tool-boundary) read clearer than noun-swapped tags from a prior desk.
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
