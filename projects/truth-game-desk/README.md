# Truth Game Desk

Soft-simulation org desk for **game-theoretic multi-agent truth plans**, inspired by [arXiv:2607.08403](https://arxiv.org/abs/2607.08403v1). Display name is **Truth Game Desk** only — never brand authors' model names; never claim hallucination-elimination product.

## Run

```bash
cd projects/truth-game-desk
npm install
npm run build
npm start          # Next.js on :3000
npm run start:api  # optional HTTP harness + static public/
npm test           # unit + UI critical + app-up live smoke
```

Offline demo: open `try.html` in a browser.

## Unique claim

**A (good):** game-theoretic multi-agent truth plans — structured challenge, payoff scoring, multi-agent game awareness  
**B (naive):** single-agent; flat majority vote without game structure; confidence-only filters

## Docs

- Product: [`PRODUCT.md`](./PRODUCT.md)
- Design: [`docs/ideas/truth-game-desk-DESIGN.md`](../../docs/ideas/truth-game-desk-DESIGN.md)
- Lessons: [`docs/guides/33-truth-game-desk-lessons.md`](../../docs/guides/33-truth-game-desk-lessons.md)
- Findings: [`FINDINGS.md`](./FINDINGS.md)

## Honesty

Method-lab experiment — not a hallucination-elimination product and not a claim to replace the authors' game-theory multi-agent framework. Authors' code: none published with this paper.
