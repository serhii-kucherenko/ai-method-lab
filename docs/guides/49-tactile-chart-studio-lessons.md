# Lessons from Tactile Chart Studio

**Product:** Tactile Chart Studio (`tactile-chart-studio`)  
**Paper:** https://arxiv.org/abs/2607.14588v1  

## What we built

A studio for accessibility and data teams to plan chart exploration for blind and low-vision users: chart library, layered tactile presentation, feedback grammar, conversational sessions, select-confirm-ask-verify, and dual compare against a visual-only baseline.

## What worked

1. **Distinct IA** — `/charts` `/layers` `/grammar` `/sessions` `/verify` `/compare` avoids the desk shell (`/jobs` `/lifecycle` `/scenario` `/batch` `/goldens`).
2. **Buyer-first landing** — `/` sells a specific BLV accessible-chart outcome, not a generic lab desk.
3. **Dual score that matches the claim** — A = conversational+tactile (layers + grammar + verify); B = visual-only with weak tactile/verify signals.
4. **Honesty fence** — Soft simulation, no Graphy branding, no claim of live tactile hardware drivers.
5. **Dual-impl goldens** — ~30 fixtures keep A/B scorers bitwise-stable across twin implementations.

## Pitfalls to avoid next time

- Noun-swapping a prior studio’s questions/searches IA onto a new domain.
- Shipping visual dashboards without a confirm-before-ask loop when the paper’s pattern requires it.
- Over-claiming hardware: method-lab products simulate plans; they do not drive refreshable tactile displays unless that is explicitly in scope.

## Practitioner checklist

- [ ] Register chart assets with clear series labels  
- [ ] Define at least one tactile layer per encoding channel  
- [ ] Cover key exploration events in feedback grammar  
- [ ] Require select → confirm before ask/verify answers  
- [ ] Compare tactile plan quality to visual-only before shipping  

## Sources

- Paper: https://arxiv.org/abs/2607.14588v1  
- Authors’ code: none with the digest  
- Product: `projects/tactile-chart-studio/`  
