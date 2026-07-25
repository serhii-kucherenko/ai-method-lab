# Video Track Studio — lessons

Guide **65** for the Method Lab climb of **Video Track Studio** (character-tracking failure diagnosis paper input).

## What we built

A multimodal eval studio where teams register long-form clips and cast characters, run name-swap track probes, diagnose failure modes, and compare track-aware diagnosis quality against a fluency-only baseline.

## Lessons

1. **Eval IA beats desk clones** — clips → characters → probes → failures → compare is the buyer story; `/jobs` `/lifecycle` shells fail the comprehensive bar. Required commercial surfaces: `/pricing` (tiers), `/demo` (guided steps), `/onboarding` (checklist progress).
2. **Cousin ≠ clone** — Consult Bench is medical consults; Attest Proof is tool/kernel proofs. Do not copy those IAs.
3. **Honesty early** — soft-sim track diagnosis, not a claim that models “watch” in production. Landing + `/honesty` must say it.
4. **Dual score needs a real baseline** — fluency-only that rewards MCQ priors without identity bind is the falsifier for “looks like tracking.”
5. **Goldens lock the claim** — ~30 dual fixtures keep track-aware vs fluency math honest across two scoring modules.
6. **Live app gate** — `next build` + app-up smoke on `/` with the display name is non-negotiable before sustain.

## Sources

- Paper: https://arxiv.org/abs/2607.11078v1  
- Authors’ code: none  
- Product: `projects/video-track-studio/`  
- Design: `docs/ideas/video-track-studio-DESIGN.md`  
