# Pathology Vision Desk

Method-lab product sourced from a simple-papers digest.

## Paper

- **Id:** 2607.09526
- **Title:** ALICE: Learning a General-Purpose Pathology Foundation Model from Vision, Vision-Language, and Slide-Level Experts
- **URL:** https://arxiv.org/abs/2607.09526v1
- **Code:** https://github.com/WonderLandxD/ALICE

## What we will build

Builders can adopt ALICE as a general-purpose backbone for computational pathology, leveraging its unified architecture and open-source release to accelerate downstream tool development.

## Run

```bash
cd projects/pathology-vision-desk
npm install
npm test
npm start
```

## Status

Smoke scaffold (claim + domain seed). Delivery upgrades to **Next.js + Tailwind + shadcn** per `docs/PRODUCT_STACK.md` and commits `docs/ideas/pathology-vision-desk-DESIGN.md` before multi-page UI.

## Config hygiene

Never write `package.json` with a UTF-8 BOM (Windows PowerShell `Set-Content -Encoding utf8` does). Node fails with `ERR_INVALID_PACKAGE_CONFIG`. Use Node `fs.writeFileSync` or run `node scripts/strip-json-bom.mjs`.
