# Security Control Desk

Method-lab product sourced from a simple-papers digest.

## Paper

- **Id:** 2607.09076
- **Title:** Neuro-Agentic Control: A Deep Learning-based LLM-Powered Agentic AI Framework for Controlling Security Controls
- **URL:** https://arxiv.org/abs/2607.09076v1
- **Code:** none published with this paper

## What we built

Safer agentic counterfactual physics injection versus a naive open-loop baseline — desk experiment, not the authors’ neuro-agentic control system. Never brand as Neuro-Agentic Control.

## Run

```bash
cd projects/security-control-desk
npm install
npm test
npm run start:api   # API + public HTML harness
npm run dev         # Next.js UI (App Router)
```

## Stack

Next.js App Router + TypeScript + Tailwind + shadcn/ui. Design note: `docs/ideas/security-control-desk-DESIGN.md`. Tutor guide: `docs/guides/17-security-control-desk-lessons.md`. Offline demo: `try.html`.

## Config hygiene

Never write `package.json` with a UTF-8 BOM (Windows PowerShell `Set-Content -Encoding utf8` does). Node fails with `ERR_INVALID_PACKAGE_CONFIG`. Use Node `fs.writeFileSync` or run `node scripts/strip-json-bom.mjs`.
