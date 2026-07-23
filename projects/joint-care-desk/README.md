# Joint Care Desk

Method-lab product sourced from a simple-papers digest.

## Paper

- **Id:** 2607.12527
- **Title:** Evidence-Grounded AI for Musculoskeletal Care
- **URL:** https://arxiv.org/abs/2607.12527v2
- **Code:** (none — software claim only)

## What we will build

This system demonstrates the potential of clinical artificial intelligence to improve longitudinal management of complex diseases, moving beyond predictive analytics to executable decision-making.

## Run

```bash
cd projects/joint-care-desk
npm install
npm test
npm start
```

## Status

Smoke scaffold (claim + domain seed). Delivery upgrades to **Next.js + Tailwind + shadcn** per `docs/PRODUCT_STACK.md` and commits `docs/ideas/joint-care-desk-DESIGN.md` before multi-page UI.

## Config hygiene

Never write `package.json` with a UTF-8 BOM (Windows PowerShell `Set-Content -Encoding utf8` does). Node fails with `ERR_INVALID_PACKAGE_CONFIG`. Use Node `fs.writeFileSync` or run `node scripts/strip-json-bom.mjs`.
