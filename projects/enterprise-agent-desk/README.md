# Enterprise Agent Desk

Method-lab product sourced from a simple-papers digest.

## Paper

- **Id:** 2607.17331
- **Title:** Agentic ERP: Multi-Agent Large Language Model Architecture for Autonomous Enterprise Resource Planning
- **URL:** https://arxiv.org/abs/2607.17331v1
- **Code:** (none — software claim only)

## What we will build

This work provides a reference architecture and evaluation protocol for building autonomous enterprise systems using multi-agent LLMs, advancing the field of AI in business process automation.

## Run

```bash
cd projects/enterprise-agent-desk
npm install
npm test
npm start
```

## Status

Smoke scaffold (claim + domain seed). Delivery upgrades to **Next.js + Tailwind + shadcn** per `docs/PRODUCT_STACK.md` and commits `docs/ideas/enterprise-agent-desk-DESIGN.md` before multi-page UI.

## Config hygiene

Never write `package.json` with a UTF-8 BOM (Windows PowerShell `Set-Content -Encoding utf8` does). Node fails with `ERR_INVALID_PACKAGE_CONFIG`. Use Node `fs.writeFileSync` or run `node scripts/strip-json-bom.mjs`.
