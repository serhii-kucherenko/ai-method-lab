# Prompt Cache Desk

Cache-aware prompt compression under a two-tier API cost model — inspired by paper 2607.15516.

- **Paper:** https://arxiv.org/abs/2607.15516v1
- **Authors' code:** none published
- **Design:** [docs/ideas/prompt-cache-desk-DESIGN.md](../../docs/ideas/prompt-cache-desk-DESIGN.md)
- **Guide:** [docs/guides/20-prompt-cache-desk-lessons.md](../../docs/guides/20-prompt-cache-desk-lessons.md)
- **Try offline:** open [try.html](./try.html) in a browser

## Run

```bash
cd projects/prompt-cache-desk
npm install
npm test
npm run start:api   # API + public harness on :3848 (or PORT)
npm run dev         # Next.js UI
```

## Claim

Query-agnostic compressed prefixes with a tier-preserving ratio bound beat vanilla, cache-only, and query-aware strategies when cache hit rate ρ depends on prefix size (hot tier below ~3500 tokens).

Honesty: method experiment; not a commercial LLM API gateway. Never brand as CAPC, Sonnet, or PayPal.
