# Rules Preferences Desk

Method-lab product sourced from a simple-papers digest.

## Paper

- **Id:** 2607.15562
- **Title:** Hard Rules, Soft Preferences: Bridging Reasoning, Learning, and Optimization for Personalized Packing Checklist Generation
- **URL:** https://arxiv.org/abs/2607.15562v1
- **Code:** https://github.com/Official529Tech/rlo-checklist

## What we built

Hard-rule gated preference selection versus a naive preference-only baseline — desk experiment, not the authors’ packing checklist system. Never brand as FlyEnJoy or RLO.

## Run

```bash
cd projects/rules-preferences-desk
npm install
npm test
npm run start:api   # API + public HTML harness
npm run dev         # Next.js UI (App Router)
```

## Stack

Next.js App Router + TypeScript + Tailwind + shadcn/ui. Design note: `docs/ideas/rules-preferences-desk-DESIGN.md`. Tutor guide: `docs/guides/18-rules-preferences-desk-lessons.md`. Offline demo: `try.html`.

## Config hygiene

Never write `package.json` with a UTF-8 BOM (Windows PowerShell `Set-Content -Encoding utf8` does). Node fails with `ERR_INVALID_PACKAGE_CONFIG`. Use Node `fs.writeFileSync` or run `node scripts/strip-json-bom.mjs`.
