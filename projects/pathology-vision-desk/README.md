# Pathology Vision Desk

Method-lab product for multi-expert pathology scoring experiments versus a naive single-view baseline.

## Paper

- **Id:** 2607.09526
- **Title:** ALICE: Learning a General-Purpose Pathology Foundation Model from Vision, Vision-Language, and Slide-Level Experts
- **URL:** https://arxiv.org/abs/2607.09526v1
- **Code:** https://github.com/WonderLandxD/ALICE

## What we built

An org desk (Next.js + Tailwind + shadcn) with vision jobs, lifecycle, batch transitions, scenario compare, audit, goldens (≥25 dual-impl), webhooks, and honesty fences. Domain sketch consolidates expert-module tags vs a flat single-view score — **not** the authors' foundation model and **not** a clinical diagnostic tool. Never branded as ALICE.

## Design

`docs/ideas/pathology-vision-desk-DESIGN.md`

## Run

```bash
cd projects/pathology-vision-desk
npm install
npm test
npm run start:api   # API + public HTML harness (PORT, default 3847)
npm run dev         # Next App Router UI on :3000
```

Offline single-file demo: open `try.html` in a browser (no server).

## StackBlitz / playground

Browser playground can exercise the offline try page and Next UI shell. Full fidelity of the API harness is `npm run start:api` locally.

## Tutor guide

`docs/guides/10-pathology-vision-desk-lessons.md`

## Config hygiene

Never write `package.json` with a UTF-8 BOM (Windows PowerShell `Set-Content -Encoding utf8` does). Node fails with `ERR_INVALID_PACKAGE_CONFIG`. Use Node `fs.writeFileSync` or run `node scripts/strip-json-bom.mjs`.
