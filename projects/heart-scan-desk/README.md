# Heart Scan Desk

Method-lab product sourced from a simple-papers digest.

## Paper

- **Id:** 2607.11287
- **Title:** A Unified Framework for Comprehensive Cardiac CT Segmentation and Phenotyping: Human-in-the-Loop Data Annotation, Vision Foundation Model Development, Multicenter Evaluation and Clinical Validation
- **URL:** https://arxiv.org/abs/2607.11287v1
- **Code:** (none — software claim only)

## What we will build

This work provides a new approach to cardiac CT segmentation and phenotyping, and the release of the dataset and code can facilitate further research in this area.

## Run

```bash
cd projects/heart-scan-desk
npm install
npm test
npm start
```

## Status

Smoke scaffold (claim + domain seed). Delivery upgrades to **Next.js + Tailwind + shadcn** per `docs/PRODUCT_STACK.md` and commits `docs/ideas/heart-scan-desk-DESIGN.md` before multi-page UI.

## Config hygiene

Never write `package.json` with a UTF-8 BOM (Windows PowerShell `Set-Content -Encoding utf8` does). Node fails with `ERR_INVALID_PACKAGE_CONFIG`. Use Node `fs.writeFileSync` or run `node scripts/strip-json-bom.mjs`.
