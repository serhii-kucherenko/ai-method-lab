# Secure Tutor Desk

Method-lab product for multi-LLM orchestrated tutoring versus a naive single-model baseline.

## Paper

- **Id:** 2607.14601
- **Title:** SYNAPSE: A Multi-LLM Orchestrated AI Tutor for Secure Software Development Education with Neurodivergent-First Design
- **URL:** https://arxiv.org/abs/2607.14601v1
- **Code:** none published

## What we built

Org desk with marketing landing, tutor jobs, lifecycle, scenario compare (single-model vs multi-LLM), batch, audit, goldens (≥25 dual-impl), webhooks, honesty, and offline `try.html`. Display name is **Secure Tutor Desk** — never brand as SYNAPSE.

## Run

```bash
cd projects/secure-tutor-desk
npm install
npm test
npm run dev          # Next on :3000
npm run start:api    # HTTP harness for public/*.html + API tests
```

Design: `docs/ideas/secure-tutor-desk-DESIGN.md`  
Guide: `docs/guides/12-secure-tutor-desk-lessons.md`

## Honesty

Workflow experiment inspired by the paper — not a replacement for the authors' tutoring platform; not a live tutoring course product.

## Config hygiene

Never write `package.json` with a UTF-8 BOM. Use Node writes or `node scripts/strip-json-bom.mjs --check`.
