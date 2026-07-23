# Realtime Deploy Desk

Method-lab product for harness-guided deployment optimization versus a naive manual-tuning baseline.

## Paper

- **Id:** 2607.18171
- **Title:** FlashRT: Agent Harness for Guiding Agents to Deploy Real-Time Multimodal Applications
- **URL:** https://arxiv.org/abs/2607.18171v1
- **Code:** none published with this paper

## What we built

Org desk with marketing landing, deploy jobs, lifecycle, scenario compare (manual-tuning vs harness-guided), batch, audit, goldens, honesty, and settings — on **Next.js + Tailwind + shadcn**. Design note: `docs/ideas/realtime-deploy-desk-DESIGN.md`.

## Run

```bash
cd projects/realtime-deploy-desk
npm install
npm test
npm run dev
```

API harness (tests / static public pages):

```bash
npm run start:api
```

## Honesty

Workflow experiment inspired by the paper — not a replacement for the authors' harness and not a production serving stack. Never brand as FlashRT.

## Config hygiene

Never write `package.json` with a UTF-8 BOM (Windows PowerShell `Set-Content -Encoding utf8` does). Node fails with `ERR_INVALID_PACKAGE_CONFIG`. Use Node `fs.writeFileSync` or run `node scripts/strip-json-bom.mjs`.
