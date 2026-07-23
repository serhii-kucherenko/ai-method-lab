# Data Science Desk

Method-lab product sourced from a simple-papers digest.

## Paper

- **Id:** 2607.15901
- **Title:** DSWorld: A Data Science World Model for Efficient Autonomous Agents
- **URL:** https://arxiv.org/abs/2607.15901v1
- **Code:** none published with this paper

## What we built

Org desk with marketing landing, agent jobs, lifecycle, scenario compare (naive step-burn vs world-model guided), batch, audit, goldens (≥25 dual-impl), webhooks, honesty, and offline `try.html`. Display name is **Data Science Desk** — never brand as DSWorld.

## Run

```bash
cd projects/data-science-desk
npm install
npm test
npm run start:api   # API + static harness on PORT (default 3847)
npm run dev         # Next.js marketing + desk UI
```

## Design

See `docs/ideas/data-science-desk-DESIGN.md` and tutor guide `docs/guides/16-data-science-desk-lessons.md`.

## Config hygiene

Never write `package.json` with a UTF-8 BOM (Windows PowerShell `Set-Content -Encoding utf8` does). Node fails with `ERR_INVALID_PACKAGE_CONFIG`. Use Node `fs.writeFileSync` or run `node scripts/strip-json-bom.mjs`.
