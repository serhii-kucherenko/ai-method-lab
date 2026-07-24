# Reason Frame Studio

**Make the agents argue before you trust them.**

Studio for teams shipping LLMs into rule-based science: scientific rule packs, multi-agent debate rounds, Bayesian/team-game scores, hallucination flags, and multi-agent vs single-agent compare.

Inspired by [arXiv:2607.08403](https://arxiv.org/abs/2607.08403v1). Not branded as G-Frame. Soft-simulation only — not a live production LLM gateway. Authors’ code: none.

## Run

```bash
cd projects/reason-frame-studio
npm install
npm run dev
```

Open http://localhost:3000 — marketing landing, then **Open rule packs**.

## Test

```bash
npm test
npm run test:app-up
```

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing |
| `/rules` | Scientific rule-pack registry |
| `/debates` | Multi-agent debate rounds |
| `/scores` | Bayesian / team-game scores |
| `/flags` | Hallucination flag console |
| `/agents` | Agent role configurations |
| `/compare` | Multi-agent vs single-agent |
| `/settings` | Org, members, webhook, exports |
| `/honesty` | Fence + Sources |

## Dual score

- **A** — multi-agent game-theoretic plan quality
- **B** — single-agent fluent baseline (no debate / game check)

## Auth

Bearer token (dev): `rfs-dev-token`

## Offline demo

Open `try.html` in a browser for a single-file approximate demo of the claim.
