# Enterprise Agent Desk

Method-lab product for multi-agent ERP coordination versus a single-agent baseline.

## Paper

- **Id:** 2607.17331
- **Title:** Agentic ERP: Multi-Agent Large Language Model Architecture for Autonomous Enterprise Resource Planning
- **URL:** https://arxiv.org/abs/2607.17331v1
- **Code:** none published

## What we built

Org desk with marketing landing, plan jobs, lifecycle, scenario compare (single-agent vs multi-agent), batch, audit, goldens (≥25 dual-impl), webhooks, honesty, and offline `try.html`. Display name is **Enterprise Agent Desk** — never brand as Agentic ERP.

## Run

```bash
cd projects/enterprise-agent-desk
npm install
npm test
npm run dev          # Next on :3000
npm run start:api    # HTTP harness for public/*.html + API tests
```

Design: `docs/ideas/enterprise-agent-desk-DESIGN.md`  
Guide: `docs/guides/14-enterprise-agent-desk-lessons.md`

## Honesty

Workflow experiment inspired by the paper — not a replacement for the authors' Agentic ERP system; not a live ERP automation product.

## Config hygiene

Never write `package.json` with a UTF-8 BOM. Use Node writes or `node scripts/strip-json-bom.mjs --check`.
