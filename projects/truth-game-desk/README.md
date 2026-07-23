# Truth Game Desk

Method-lab product sourced from a simple-papers digest.

## Paper

- **Id:** 2607.08403
- **Title:** Game Theory Driven Multi-Agent Framework Mitigates Language Model Hallucination
- **URL:** https://arxiv.org/abs/2607.08403v1
- **Code:** (none — software claim only)

## What we will build

The G-Frame framework offers a scalable paradigm for developing more reliable lightweight LLMs in specialized, rule-based domains by integrating multi-agent systems, Bayesian principles, and game theory, addressing a key limitation of current models.

## Run

```bash
cd projects/truth-game-desk
npm install
npm test
npm start
```

## Status

Smoke scaffold (claim + domain seed). Delivery upgrades to **Next.js + Tailwind + shadcn** per `docs/PRODUCT_STACK.md` and commits `docs/ideas/truth-game-desk-DESIGN.md` before multi-page UI.

## Config hygiene

Never write `package.json` with a UTF-8 BOM (Windows PowerShell `Set-Content -Encoding utf8` does). Node fails with `ERR_INVALID_PACKAGE_CONFIG`. Use Node `fs.writeFileSync` or run `node scripts/strip-json-bom.mjs`.
