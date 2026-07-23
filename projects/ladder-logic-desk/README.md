# Ladder Logic Desk

Method-lab product sourced from a simple-papers digest.

## Paper

- **Id:** 2607.08417
- **Title:** Ladder Logic Desk Bombs in IEC 61131-3 PLC Programs using ESBMC-PLC+: A Formal Verification Approach with Trigger Synthesis
- **URL:** https://arxiv.org/abs/2607.08417v1
- **Code:** (none — software claim only)

## What we will build

This tool can help improve the security of PLC programs and provide a new approach to detecting malicious code in these programs.

## Run

```bash
cd projects/ladder-logic-desk
npm install
npm test
npm start
```

## Status

Smoke scaffold (claim + domain seed). Delivery upgrades to **Next.js + Tailwind + shadcn** per `docs/PRODUCT_STACK.md` and commits `docs/ideas/ladder-logic-desk-DESIGN.md` before multi-page UI.

## Config hygiene

Never write `package.json` with a UTF-8 BOM (Windows PowerShell `Set-Content -Encoding utf8` does). Node fails with `ERR_INVALID_PACKAGE_CONFIG`. Use Node `fs.writeFileSync` or run `node scripts/strip-json-bom.mjs`.
