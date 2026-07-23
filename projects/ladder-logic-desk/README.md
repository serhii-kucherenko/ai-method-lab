# Ladder Logic Desk

Method-lab product for formal trigger-synthesis / bomb-detection scoring versus a naive scan baseline.

## Paper

- **Id:** 2607.08417
- **Title:** Detecting Ladder Logic Bombs in IEC 61131-3 PLC Programs using ESBMC-PLC+: A Formal Verification Approach with Trigger Synthesis
- **URL:** https://arxiv.org/abs/2607.08417v1
- **Code:** none published

## What this is

Org desk with marketing landing, verification jobs, lifecycle, scenario compare (naive scan vs formal), batch, audit, goldens (≥25 dual-impl), webhooks, honesty, and offline `try.html`. Display name is **Ladder Logic Desk** — never brand as ESBMC-PLC+ or IEC statute codes.

## Run

```bash
cd projects/ladder-logic-desk
npm install
npm test
npm run dev          # Next.js UI on :3000
npm run start:api    # JSON API + static harness on :3847 (or PORT)
```

## Honesty

Method experiment inspired by the paper — **not** a replacement for the authors' formal verifier and **not** a commercial PLC security product.

## Design

See `docs/ideas/ladder-logic-desk-DESIGN.md` and tutor guide `docs/guides/15-ladder-logic-desk-lessons.md`.

## Config hygiene

Never write `package.json` with a UTF-8 BOM. Use Node writes or `node scripts/strip-json-bom.mjs --check`.
