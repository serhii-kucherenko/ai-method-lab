# Pocket Molecule Desk

Method-lab product sourced from a simple-papers digest.

## Paper

- **Id:** 2607.12349
- **Title:** Generating Developable 3D Molecules via Pocket-Conditioned Diffusion and Property-Aware Optimization
- **URL:** https://arxiv.org/abs/2607.12349v1
- **Code:** (none — software claim only)

## What we will build

ConDitar-dev could be a useful tool for researchers and developers working on drug discovery and development, but its effectiveness and limitations need to be further evaluated.

## Run

```bash
cd projects/pocket-molecule-desk
npm install
npm test
npm start
```

## Status

Smoke scaffold (claim + domain seed). Delivery upgrades to **Next.js + Tailwind + shadcn** per `docs/PRODUCT_STACK.md` and commits `docs/ideas/pocket-molecule-desk-DESIGN.md` before multi-page UI.

## Config hygiene

Never write `package.json` with a UTF-8 BOM (Windows PowerShell `Set-Content -Encoding utf8` does). Node fails with `ERR_INVALID_PACKAGE_CONFIG`. Use Node `fs.writeFileSync` or run `node scripts/strip-json-bom.mjs`.
