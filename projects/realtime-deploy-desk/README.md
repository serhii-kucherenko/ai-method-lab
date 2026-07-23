# Realtime Deploy Desk

Method-lab product sourced from a simple-papers digest.

## Paper

- **Id:** 2607.18171
- **Title:** FlashRT: Agent Harness for Guiding Agents to Deploy Real-Time Multimodal Applications
- **URL:** https://arxiv.org/abs/2607.18171v1
- **Code:** (none — software claim only)

## What we will build

This work offers a novel, agent-driven approach to automate the complex optimization of AI model deployments, potentially reducing the need for expert manual tuning and making high-performance AI more accessible to developers.

## Run

```bash
cd projects/realtime-deploy-desk
npm install
npm test
npm start
```

## Status

Smoke scaffold (claim + domain seed). Delivery upgrades to **Next.js + Tailwind + shadcn** per `docs/PRODUCT_STACK.md` and commits `docs/ideas/realtime-deploy-desk-DESIGN.md` before multi-page UI.

## Config hygiene

Never write `package.json` with a UTF-8 BOM (Windows PowerShell `Set-Content -Encoding utf8` does). Node fails with `ERR_INVALID_PACKAGE_CONFIG`. Use Node `fs.writeFileSync` or run `node scripts/strip-json-bom.mjs`.
