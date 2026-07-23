# Security Control Desk

Method-lab product sourced from a simple-papers digest.

## Paper

- **Id:** 2607.09076
- **Title:** Neuro-Agentic Control: A Deep Learning-based LLM-Powered Agentic AI Framework for Controlling Security Controls
- **URL:** https://arxiv.org/abs/2607.09076v1
- **Code:** (none — software claim only)

## What we will build

The Counterfactual Physics Injection mechanism and coupling of an LLM planner with a time-series foundation model offer a new architecture pattern for safe agentic control, though broader validation is needed.

## Run

```bash
cd projects/security-control-desk
npm install
npm test
npm start
```

## Status

Smoke scaffold (claim + domain seed). Delivery upgrades to **Next.js + Tailwind + shadcn** per `docs/PRODUCT_STACK.md` and commits `docs/ideas/security-control-desk-DESIGN.md` before multi-page UI.

## Config hygiene

Never write `package.json` with a UTF-8 BOM (Windows PowerShell `Set-Content -Encoding utf8` does). Node fails with `ERR_INVALID_PACKAGE_CONFIG`. Use Node `fs.writeFileSync` or run `node scripts/strip-json-bom.mjs`.
