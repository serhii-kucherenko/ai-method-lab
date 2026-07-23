# Agent Safety Desk

Method-lab product sourced from a simple-papers digest.

## Paper

- **Id:** 2607.14570
- **Title:** Agent Safety Desk Safety: A Structural Monitoring Approach
- **URL:** https://arxiv.org/abs/2607.14570v1
- **Code:** (none — software claim only)

## What we will build

The IFG monitor provides a new approach to detecting security regressions in AI agent deployments, which can contribute to the development of more robust and trustworthy AI systems.

## Run

```bash
cd projects/agent-safety-desk
npm install
npm test
npm start
```

## Status

Smoke scaffold (claim + domain seed). Delivery upgrades to **Next.js + Tailwind + shadcn** per `docs/PRODUCT_STACK.md` and commits `docs/ideas/agent-safety-desk-DESIGN.md` before multi-page UI.

## Config hygiene

Never write `package.json` with a UTF-8 BOM (Windows PowerShell `Set-Content -Encoding utf8` does). Node fails with `ERR_INVALID_PACKAGE_CONFIG`. Use Node `fs.writeFileSync` or run `node scripts/strip-json-bom.mjs`.
