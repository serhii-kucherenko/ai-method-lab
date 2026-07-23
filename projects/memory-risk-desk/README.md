# Memory Risk Desk

Method-lab product sourced from a simple-papers digest.

## Paper

- **Id:** 2607.11656
- **Title:** Imputation-free transformer learning enables robust Alzheimer's disease prediction and calibrated uncertainty quantification across heterogeneous clinical cohorts
- **URL:** https://arxiv.org/abs/2607.11656v2
- **Code:** (none — software claim only)

## What we will build

NITROGEN's imputation-free approach could be useful for other machine learning applications where missing data is a problem

## Run

```bash
cd projects/memory-risk-desk
npm install
npm test
npm start
```

## Status

Smoke scaffold (claim + domain seed). Delivery upgrades to **Next.js + Tailwind + shadcn** per `docs/PRODUCT_STACK.md` and commits `docs/ideas/memory-risk-desk-DESIGN.md` before multi-page UI.

## Config hygiene

Never write `package.json` with a UTF-8 BOM (Windows PowerShell `Set-Content -Encoding utf8` does). Node fails with `ERR_INVALID_PACKAGE_CONFIG`. Use Node `fs.writeFileSync` or run `node scripts/strip-json-bom.mjs`.
