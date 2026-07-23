# Secure Tutor Desk

Method-lab product sourced from a simple-papers digest.

## Paper

- **Id:** 2607.14601
- **Title:** SYNAPSE: A Multi-LLM Orchestrated AI Tutor for Secure Software Development Education with Neurodivergent-First Design
- **URL:** https://arxiv.org/abs/2607.14601v1
- **Code:** (none — software claim only)

## What we will build

SYNAPSE demonstrates the potential of multi-LLM orchestration for adaptive tutoring, but further research is needed to fully realize its potential

## Run

```bash
cd projects/secure-tutor-desk
npm install
npm test
npm start
```

## Status

Smoke scaffold (claim + domain seed). Delivery upgrades to **Next.js + Tailwind + shadcn** per `docs/PRODUCT_STACK.md` and commits `docs/ideas/secure-tutor-desk-DESIGN.md` before multi-page UI.

## Config hygiene

Never write `package.json` with a UTF-8 BOM (Windows PowerShell `Set-Content -Encoding utf8` does). Node fails with `ERR_INVALID_PACKAGE_CONFIG`. Use Node `fs.writeFileSync` or run `node scripts/strip-json-bom.mjs`.
