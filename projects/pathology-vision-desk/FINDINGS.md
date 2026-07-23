# Pathology Vision Desk — findings

## Sustain (A03__P-sustain-001__pathology-vision-desk__r1)

**Result:** green  
**Stack:** Next.js App Router + TypeScript + Tailwind + shadcn/ui (Radix)  
**Design:** `docs/ideas/pathology-vision-desk-DESIGN.md`  
**Guide:** `docs/guides/10-pathology-vision-desk-lessons.md`  
**Try:** `projects/pathology-vision-desk/try.html`

### Claim

Multi-expert pathology scoring (vision / vision-language / slide expert tags) vs naive single-view baseline. Dual-impl goldens (≥28 fixtures) agree on A/B. Desk pattern: org, projects, vision jobs, lifecycle, batch, audit, webhooks, honesty.

### Honesty

Not a clinical diagnostic tool. Not a replacement for the authors' ALICE foundation model. Never brand the product as ALICE.

### Proof

`npm test` — 36 pass (smoke, crud, workflow, integrate, scale, sustain, sustain-matrix, ui-critical).

### Notes

Python sidecar not required for this desk sketch; claim stayed readable as TypeScript dual-impl. Offline try.html approximates the scenario compare without a server.
