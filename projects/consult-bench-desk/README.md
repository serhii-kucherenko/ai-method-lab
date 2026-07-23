# Consult Bench Desk

Soft-simulation org desk for **real-world multimodal consult evaluation plans**, inspired by [arXiv:2607.09142](https://arxiv.org/abs/2607.09142v1). Display name is **Consult Bench Desk** only — never brand authors' model names; never claim telemedicine product.

## Run

```bash
cd projects/consult-bench-desk
npm install
npm run build
npm start          # Next.js on :3000
npm run start:api  # optional HTTP harness + static public/
npm test           # unit + UI critical + app-up live smoke
```

Offline demo: open `try.html` in a browser.

## Unique claim

**A (good):** real-world multimodal consult evaluation plans — text + image evidence, real consult cases, rubric across modalities  
**B (naive):** text-only; image-blind scoring; synthetic-chat-only benches

## Docs

- Product: [`PRODUCT.md`](./PRODUCT.md)
- Design: [`docs/ideas/consult-bench-desk-DESIGN.md`](../../docs/ideas/consult-bench-desk-DESIGN.md)
- Lessons: [`docs/guides/32-consult-bench-desk-lessons.md`](../../docs/guides/32-consult-bench-desk-lessons.md)
- Findings: [`FINDINGS.md`](./FINDINGS.md)

## Honesty

Method-lab experiment — not a telemedicine product and not a claim to replace the authors' MedRealMM benchmark. Authors' code: none published with this paper.
