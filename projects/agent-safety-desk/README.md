# Agent Safety Desk

Method-lab product for structural monitoring versus a naive checklist baseline.

## Paper

- **Id:** 2607.14570
- **Title:** Democratizing Agent Deployment Safety: A Structural Monitoring Approach
- **URL:** https://arxiv.org/abs/2607.14570v1
- **Code:** none published

## What we built

Org desk with marketing landing, safety jobs, lifecycle, scenario compare (checklist vs structural), batch, audit, goldens (≥25 dual-impl), webhooks, honesty, and offline `try.html`. Display name is **Agent Safety Desk** — never brand as IFG.

## Run

```bash
cd projects/agent-safety-desk
npm install
npm test
npm run dev          # Next on :3000
npm run start:api    # HTTP harness for public/*.html + API tests
```

Design: `docs/ideas/agent-safety-desk-DESIGN.md`  
Guide: `docs/guides/13-agent-safety-desk-lessons.md`

## Honesty

Workflow experiment inspired by the paper — not a replacement for the authors' safety monitor system; not a live agent safety vendor product.

## Config hygiene

Never write `package.json` with a UTF-8 BOM. Use Node writes or `node scripts/strip-json-bom.mjs --check`.
