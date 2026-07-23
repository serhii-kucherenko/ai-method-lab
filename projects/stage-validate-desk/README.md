# Stage Validate Desk

Stage-validated inference / port plans: gate each stage against a reference and measure long-context / bit-width / kernel choices — vs naive short-bench intuition.

**Paper:** https://arxiv.org/abs/2607.14568v1  
**Authors' code:** none published  

## Run

```bash
cd projects/stage-validate-desk
npm install
npm run dev          # Next.js UI
npm run start:api    # optional Node harness API + public/*.html
npm run test:unit
npm run test:app-up  # build + next start GET /
```

Desk entry: `/jobs` · Landing: `/` · Offline: `try.html`

## Honesty

Method experiment inspired by the paper. Not a Fermi CUDA engine or MiniCPM product. Never brand MiniCPM, Fermi, or Tesla C2075 as the product name.
