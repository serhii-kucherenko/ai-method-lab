# Attest Proof Studio

Tool-attested empirical answers with checkable soft-sim proof chains — for AI platform and trust/eval leads.

Inspired by [EG-VAR](https://arxiv.org/abs/2607.12650v1) (Evidence-Grounded Verified Agentic Reasoning via Tool-Attested Kernel Proofs). **Not** an EG-VAR rebrand. **Not** production Lean 4 certification. Authors’ code: none published.

## Quick start

```bash
cd projects/attest-proof-studio
npm install
npm run dev
```

Open http://localhost:3000 — marketing landing at `/`, studio entry at `/claims`.

Dev API bearer token: `aps-dev-token`.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Next.js app |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm test` | Goldens + store + UI critical path |
| `npm run test:app-up` | Live build + start smoke on `/` |
| `npm run gen:goldens` | Regenerate dual-impl fixtures |

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing |
| `/pricing` | Hypothetical SaaS tiers (seats / usage / site) |
| `/demo` | Step-by-step guided in-app happy path |
| `/onboarding` | First-run checklist with progress |
| `/claims` | Claim registry |
| `/attestations` | Tool attestations |
| `/proofs` | Soft-sim proof chains |
| `/kernel` | Kernel step walker |
| `/ledger` | Evidence grounding ledger |
| `/compare` | Attested vs fluent-only |
| `/settings` | Org, members, exports |
| `/honesty` | Soft-sim fence + Sources |

## Dual scoring

- **A** — tool-attested proof quality  
- **B** — fluent-only baseline  

~30 dual-impl goldens under `test/fixtures/`.

## Offline demo

Open `try.html` in a browser for a standalone soft-sim compare.

## Guide

`docs/guides/64-attest-proof-studio-lessons.md`
