# Consult Bench Desk

Method-lab product sourced from a simple-papers digest.

## Paper

- **Id:** 2607.09142
- **Title:** MedRealMM: A Real-World Multimodal Benchmark for Chinese Online Medical Consultation
- **URL:** https://arxiv.org/abs/2607.09142v1
- **Code:** (none — software claim only)

## What we will build

Builders now have a realistic, multimodal benchmark and rubric to train and test LLMs for online consultation; the dataset is public on Hugging Face.

## Run

```bash
cd projects/consult-bench-desk
npm install
npm test
npm start
```

## Status

Smoke scaffold (claim + domain seed). Delivery upgrades to **Next.js + Tailwind + shadcn** per `docs/PRODUCT_STACK.md` and commits `docs/ideas/consult-bench-desk-DESIGN.md` before multi-page UI.

## Config hygiene

Never write `package.json` with a UTF-8 BOM (Windows PowerShell `Set-Content -Encoding utf8` does). Node fails with `ERR_INVALID_PACKAGE_CONFIG`. Use Node `fs.writeFileSync` or run `node scripts/strip-json-bom.mjs`.
