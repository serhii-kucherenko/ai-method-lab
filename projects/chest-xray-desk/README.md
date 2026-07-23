# Chest Xray Desk

Soft-simulation org desk for **classify → localize → clinically validate plans**, inspired by [arXiv:2607.09305](https://arxiv.org/abs/2607.09305v1). Display name is **Chest Xray Desk** only — never brand authors' model names; never claim medical device.

## Run

```bash
cd projects/chest-xray-desk
npm install
npm run build
npm start          # Next.js on :3000
npm run start:api  # optional HTTP harness + static public/
npm test           # unit + UI critical + app-up live smoke
```

Offline demo: open `try.html` in a browser.

## Unique claim

**A (good):** classify → localize → clinically validate plans — label + region localization pathway, human-in-loop review, clinical validation awareness  
**B (naive):** classification-only; localization without clinical gate; unverified single-threshold alerts

## Docs

- Product: [`PRODUCT.md`](./PRODUCT.md)
- Design: [`docs/ideas/chest-xray-desk-DESIGN.md`](../../docs/ideas/chest-xray-desk-DESIGN.md)
- Lessons: [`docs/guides/31-chest-xray-desk-lessons.md`](../../docs/guides/31-chest-xray-desk-lessons.md)
- Findings: [`FINDINGS.md`](./FINDINGS.md)

## Honesty

Method-lab experiment — not a clinical diagnostic product and not a claim to replace the authors' Thailand deep learning system. Authors' code: none published with this paper.
