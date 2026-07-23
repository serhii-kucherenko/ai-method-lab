# Data Science Desk

Method-lab product sourced from a simple-papers digest.

## Paper

- **Id:** 2607.15901
- **Title:** DSWorld: A Data Science World Model for Efficient Autonomous Agents
- **URL:** https://arxiv.org/abs/2607.15901v1
- **Code:** (none — software claim only)

## What we will build

This framework offers a significant leap in efficiency for developing and deploying autonomous data science agents, potentially enabling more complex and faster automated data analysis workflows.

## Run

```bash
cd projects/data-science-desk
npm install
npm test
npm start
```

## Status

Smoke scaffold (claim + domain seed). Delivery upgrades to **Next.js + Tailwind + shadcn** per `docs/PRODUCT_STACK.md` and commits `docs/ideas/data-science-desk-DESIGN.md` before multi-page UI.

## Config hygiene

Never write `package.json` with a UTF-8 BOM (Windows PowerShell `Set-Content -Encoding utf8` does). Node fails with `ERR_INVALID_PACKAGE_CONFIG`. Use Node `fs.writeFileSync` or run `node scripts/strip-json-bom.mjs`.
