# Wild Locomotion Desk

Multi-skill perceptive locomotion desk: skill library + onboard perception + autonomous transitions for mixed obstacles — versus a single-skill flat-terrain naive policy.

**Paper:** https://arxiv.org/abs/2607.13579v1  
**Authors' code:** none published  
**Display name:** Wild Locomotion Desk (never brand APT-RL)

## Run

```bash
npm install
npm run dev          # Next.js UI at http://localhost:3000
npm run start:api    # API + static harness (optional)
npm test             # unit + app-up live smoke
```

## Try offline

Open `try.html` in a browser — no server required for a soft scenario compare.

## Honesty

Workflow experiment inspired by the paper. Soft simulation only. Not a replacement for the authors' quadruped controller or commercial robot stacks.

## Docs

- Product: `PRODUCT.md`
- Findings: `FINDINGS.md`
- Design: `../../docs/ideas/wild-locomotion-desk-DESIGN.md`
- Lessons: `../../docs/guides/25-wild-locomotion-desk-lessons.md`
