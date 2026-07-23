# Heart Scan Desk

Soft-simulation org desk for **unified segmentation + phenotyping plans**, inspired by [arXiv:2607.11287](https://arxiv.org/abs/2607.11287v1). Display name is **Heart Scan Desk** only — never brand authors' model names; never claim medical device.

## Run

```bash
cd projects/heart-scan-desk
npm install
npm run build
npm start          # Next.js on :3000
npm run start:api  # optional HTTP harness + static public/
npm test           # unit + UI critical + app-up live smoke
```

Offline demo: open `try.html` in a browser.

## Unique claim

**A (good):** unified segmentation + phenotyping plans — joint structure+phenotype pathway, human-in-loop review, multicenter-aware validation  
**B (naive):** segmentation-only; phenotype-from-raw-pixels-only; single-center unchecked

## Docs

- Product: [`PRODUCT.md`](./PRODUCT.md)
- Design: [`docs/ideas/heart-scan-desk-DESIGN.md`](../../docs/ideas/heart-scan-desk-DESIGN.md)
- Lessons: [`docs/guides/30-heart-scan-desk-lessons.md`](../../docs/guides/30-heart-scan-desk-lessons.md)
- Findings: [`FINDINGS.md`](./FINDINGS.md)

## Honesty

Method-lab experiment — not a clinical diagnostic product and not a claim to replace the authors' foundation model. Authors' code: none published with this paper.
