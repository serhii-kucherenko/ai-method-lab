# Quantum Kernel Desk

Method-lab product sourced from a simple-papers digest.

## Paper

- **Id:** 2607.11701
- **Title:** $\mathtt{Q^2SAR}$: overcoming classical bottlenecks in drug discovery via quantum multiple kernel learning
- **URL:** https://arxiv.org/abs/2607.11701v1
- **Code:** (none — software claim only)

## What we will build

This framework could contribute to the development of autonomous cognitive architectures and self-improving drug discovery pipelines, but its impact on the field depends on further research and validation

## Run

```bash
cd projects/quantum-kernel-desk
npm install
npm test
npm start
```

## Status

Smoke scaffold (claim + domain seed). Delivery upgrades to **Next.js + Tailwind + shadcn** per `docs/PRODUCT_STACK.md` and commits `docs/ideas/quantum-kernel-desk-DESIGN.md` before multi-page UI.

## Config hygiene

Never write `package.json` with a UTF-8 BOM (Windows PowerShell `Set-Content -Encoding utf8` does). Node fails with `ERR_INVALID_PACKAGE_CONFIG`. Use Node `fs.writeFileSync` or run `node scripts/strip-json-bom.mjs`.
