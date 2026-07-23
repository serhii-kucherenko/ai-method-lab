# Evidence Synthesis Desk

Evidence synthesis desk: screening discipline then standardized pooling — inspired by paper 2607.15247.

- **Paper:** https://arxiv.org/abs/2607.15247v1
- **Authors' code:** none published with this paper
- **Guide:** [docs/guides/21-evidence-synthesis-desk-lessons.md](../../docs/guides/21-evidence-synthesis-desk-lessons.md)
- **Design:** [docs/ideas/evidence-synthesis-desk-DESIGN.md](../../docs/ideas/evidence-synthesis-desk-DESIGN.md)
- **Try offline:** open `try.html` in a browser

## Run

```bash
cd projects/evidence-synthesis-desk
npm install
npm test
npm run start:api   # API + static harness on :3849 (or PORT)
npm run dev         # Next.js UI
```

## Claim

Screen and eligibility before pooling: standardized effect sizes + random-effects synthesis with audit — versus naive average of reported numbers that skip screening discipline.

Honesty: method experiment; never brand as AutoSynthesis.
