# Memory Risk Desk

Soft-simulation org desk for **imputation-free + calibrated-uncertainty plans**, inspired by [arXiv:2607.11656](https://arxiv.org/abs/2607.11656v2). Display name is **Memory Risk Desk** only — never brand authors' model names; never claim medical device.

## Run

```bash
cd projects/memory-risk-desk
npm install
npm run build
npm start          # Next.js on :3000
npm run start:api  # optional HTTP harness + static public/
npm test           # unit + UI critical + app-up live smoke
```

Offline demo: open `try.html` in a browser.

## Unique claim

**A (good):** imputation-free + calibrated-uncertainty plans — native missingness, calibrated risk bands across cohorts  
**B (naive):** mean/mode imputation then flat classifier; uncalibrated high-confidence scores; single-cohort-only ignoring site shift

## Docs

- Product: [`PRODUCT.md`](./PRODUCT.md)
- Design: [`docs/ideas/memory-risk-desk-DESIGN.md`](../../docs/ideas/memory-risk-desk-DESIGN.md)
- Lessons: [`docs/guides/29-memory-risk-desk-lessons.md`](../../docs/guides/29-memory-risk-desk-lessons.md)
- Findings: [`FINDINGS.md`](./FINDINGS.md)

## Honesty

Method-lab experiment — not a clinical diagnostic product and not a claim to replace the authors' transformer. Authors' code: none published with this paper.
