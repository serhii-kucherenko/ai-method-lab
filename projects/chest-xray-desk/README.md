# Chest Xray Desk

Method-lab product sourced from a simple-papers digest.

## Paper

- **Id:** 2607.09305
- **Title:** From Classification to Localization and Clinical Validation: Large-Scale Development of a Deep Learning System for Thoracic Disease Detection on Chest Radiographs in Thailand
- **URL:** https://arxiv.org/abs/2607.09305v1
- **Code:** (none — software claim only)

## What we will build

The Attend-and-Compare Modules and PCAM aggregation layer enable simultaneous classification and localization in a single model, which may influence future CXR AI architectures.

## Run

```bash
cd projects/chest-xray-desk
npm install
npm test
npm start
```

## Status

Smoke scaffold (claim + domain seed). Delivery upgrades to **Next.js + Tailwind + shadcn** per `docs/PRODUCT_STACK.md` and commits `docs/ideas/chest-xray-desk-DESIGN.md` before multi-page UI.

## Config hygiene

Never write `package.json` with a UTF-8 BOM (Windows PowerShell `Set-Content -Encoding utf8` does). Node fails with `ERR_INVALID_PACKAGE_CONFIG`. Use Node `fs.writeFileSync` or run `node scripts/strip-json-bom.mjs`.
